import { useAutoShowResults } from '@hooks/useAutoShowResults';
import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import { useTDImageCardUrl } from '@hooks/useTDImageCardUrl';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';

import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DailyVitralEntry } from 'types/games';
import { gameInfo } from '../info';
import { buildGridFromPiecesOrder, formatElapsedTime } from './helpers';
import {
  COLS,
  countConnections,
  countCorrectPieces,
  getConnectedGroupIndices,
  getPieceBorders,
  getTotalPossibleConnections,
  HEART_LOSS_INTERVAL_SECONDS,
  moveConnectedGroup,
  VITRAL_TOTAL_HEARTS,
} from './puzzleUtils';
import type { BoardMeasures, GameState, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  grid: [],
  activeDrag: null,
};

/**
 * Drives a single day's Vitral puzzle: timer, heart loss, connected-group
 * dragging, score updates, persistence, and result-state transitions.
 *
 * @param data - Today's Vitral payload.
 * @param initialState - Starting persisted state for the current day.
 * @returns Everything the Vitral screen needs to render and interact.
 */
export function useVitralEngine(
  data: DailyVitralEntry,
  initialState: GameState,
) {
  const imageUrl = useTDImageCardUrl(data.cardId);
  const rulesGameId = useAppRuntimeStore((state) => state.rulesGameId);
  const isRulesOpen = rulesGameId === gameInfo.id;
  const rows = Math.max(1, Math.ceil(data.pieces.length / COLS));
  const totalPossibleConnections = useMemo(
    () => getTotalPossibleConnections(rows),
    [rows],
  );

  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(() => ({
    ...INITIAL_SESSION,
    grid: buildGridFromPiecesOrder(initialState.piecesOrder),
  }));
  const [showResults, setShowResults] = useState(false);
  const [measures, setMeasures] = useState<BoardMeasures>({
    width: 0,
    height: 0,
    cellWidth: 0,
    cellHeight: 0,
    rows,
    totalSlots: data.pieces.length,
  });
  const boardElementRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const dragRef = useRef(session.activeDrag);
  const gridRef = useRef(session.grid);
  const stateRef = useRef(state);
  const measuresRef = useRef(measures);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  useEffect(() => {
    dragRef.current = session.activeDrag;
  }, [session.activeDrag]);

  useEffect(() => {
    gridRef.current = session.grid;
  }, [session.grid]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    measuresRef.current = measures;
  }, [measures]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useAutoShowResults(isComplete, setShowResults);

  useEffect(() => {
    if (isComplete || isRulesOpen) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setState((previousState) => ({
        ...previousState,
        timeElapsed: previousState.timeElapsed + 1,
        status:
          previousState.status === GAME_LIFECYCLE_STATUS.IDLE
            ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
            : previousState.status,
      }));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isComplete, isRulesOpen]);

  useEffect(() => {
    if (isComplete) {
      return;
    }

    const lossInterval = HEART_LOSS_INTERVAL_SECONDS + data.pieces.length;
    const expectedHearts = Math.max(
      0,
      VITRAL_TOTAL_HEARTS - Math.floor(state.timeElapsed / lossInterval),
    );

    if (expectedHearts === state.hearts) {
      return;
    }

    const isNowLose = expectedHearts <= 0;
    if (isNowLose) {
      playSFX('lose');
      vibrate('lose');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
    }

    setState((previousState) => ({
      ...previousState,
      hearts: expectedHearts,
      status: isNowLose
        ? GAME_LIFECYCLE_STATUS.LOSE
        : previousState.status === GAME_LIFECYCLE_STATUS.IDLE
          ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
          : previousState.status,
    }));
  }, [data.pieces.length, isComplete, state.hearts, state.timeElapsed]);

  const updateMeasures = useCallback(() => {
    const boardElement = boardElementRef.current;
    if (!boardElement?.parentElement) {
      return;
    }

    const totalSlots = data.pieces.length;
    const nextRows = Math.max(1, Math.ceil(totalSlots / COLS));
    const parentWidth =
      boardElement.parentElement.getBoundingClientRect().width;
    const maxWidth = Math.max(parentWidth - 24, 240);
    const maxHeight = Math.max(window.innerHeight - 280, 280);
    let width = maxWidth;
    let height = width * 1.5;

    if (height > maxHeight) {
      height = maxHeight;
      width = height / 1.5;
    }

    setMeasures({
      width,
      height,
      cellWidth: width / COLS,
      cellHeight: height / nextRows,
      rows: nextRows,
      totalSlots,
    });
  }, [data.pieces.length]);

  const boardRef = useCallback(
    (node: HTMLDivElement | null) => {
      resizeObserverRef.current?.disconnect();
      boardElementRef.current = node;

      if (!node) {
        return;
      }

      updateMeasures();
      resizeObserverRef.current = new ResizeObserver(() => updateMeasures());
      resizeObserverRef.current.observe(node.parentElement ?? node);
    },
    [updateMeasures],
  );

  useEffect(() => {
    window.addEventListener('resize', updateMeasures);
    return () => {
      window.removeEventListener('resize', updateMeasures);
      resizeObserverRef.current?.disconnect();
    };
  }, [updateMeasures]);

  const finishDrag = useCallback(
    (nextTargetIndex: number) => {
      const activeDrag = dragRef.current;
      if (!activeDrag || isComplete) {
        setSession((previousSession) => ({
          ...previousSession,
          activeDrag: null,
        }));
        return;
      }

      if (nextTargetIndex === activeDrag.originIndex) {
        playSFX('bubbleOut');
        setSession((previousSession) => ({
          ...previousSession,
          activeDrag: null,
        }));
        return;
      }

      const nextGrid = moveConnectedGroup(
        gridRef.current,
        activeDrag.originIndex,
        nextTargetIndex,
        activeDrag.groupOffsets,
        measuresRef.current.totalSlots,
      );

      if (!nextGrid) {
        playSFX('bubbleOut');
        setSession((previousSession) => ({
          ...previousSession,
          activeDrag: null,
        }));
        return;
      }

      const connectionsBefore = countConnections(gridRef.current);
      const connectionsAfter = countConnections(nextGrid);
      const newConnections = connectionsAfter - connectionsBefore;
      const nextStatus =
        connectionsAfter === totalPossibleConnections
          ? GAME_LIFECYCLE_STATUS.WIN
          : stateRef.current.status === GAME_LIFECYCLE_STATUS.IDLE
            ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
            : stateRef.current.status;

      playSFX(nextStatus === GAME_LIFECYCLE_STATUS.WIN ? 'win' : 'swap');
      if (nextStatus === GAME_LIFECYCLE_STATUS.WIN) {
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      }

      setSession((previousSession) => ({
        ...previousSession,
        grid: nextGrid,
        activeDrag: null,
      }));

      setState((previousState) => ({
        ...previousState,
        swapCount: previousState.swapCount + 1,
        status: nextStatus,
        piecesOrder: nextGrid.map((piece) => piece?.id ?? -1),
        progress:
          totalPossibleConnections > 0
            ? connectionsAfter / totalPossibleConnections
            : 1,
        score: Math.max(
          previousState.score +
            (newConnections > 0 ? newConnections * previousState.hearts : 0) -
            (nextStatus === GAME_LIFECYCLE_STATUS.WIN
              ? previousState.timeElapsed
              : 0),
          0,
        ),
      }));
    },
    [isComplete, totalPossibleConnections],
  );

  useEffect(() => {
    if (!session.activeDrag) {
      return;
    }

    function updateDragTarget(pointerX: number, pointerY: number) {
      const boardRect = boardElementRef.current?.getBoundingClientRect();
      if (!boardRect) {
        return;
      }

      const { cellHeight, cellWidth, rows: totalRows } = measuresRef.current;
      const x = Math.max(
        0,
        Math.min(pointerX - boardRect.left, boardRect.width - 1),
      );
      const y = Math.max(
        0,
        Math.min(pointerY - boardRect.top, boardRect.height - 1),
      );
      const col = Math.max(0, Math.min(COLS - 1, Math.floor(x / cellWidth)));
      const row = Math.max(
        0,
        Math.min(totalRows - 1, Math.floor(y / cellHeight)),
      );
      const targetIndex = Math.min(
        measuresRef.current.totalSlots - 1,
        row * COLS + col,
      );

      setSession((previousSession) => {
        if (!previousSession.activeDrag) {
          return previousSession;
        }

        return {
          ...previousSession,
          activeDrag: {
            ...previousSession.activeDrag,
            pointerX: x,
            pointerY: y,
            targetIndex,
          },
        };
      });
    }

    function handlePointerMove(event: PointerEvent) {
      updateDragTarget(event.clientX, event.clientY);
    }

    function handlePointerUp(event: PointerEvent) {
      updateDragTarget(event.clientX, event.clientY);
      const nextTargetIndex = dragRef.current?.targetIndex;
      finishDrag(nextTargetIndex ?? dragRef.current?.originIndex ?? 0);
    }

    function handlePointerCancel() {
      setSession((previousSession) => ({
        ...previousSession,
        activeDrag: null,
      }));
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
    };
  }, [finishDrag, session.activeDrag]);

  const startDrag = useCallback(
    (index: number, pointerX: number, pointerY: number) => {
      if (isComplete) {
        return;
      }

      const piece = gridRef.current[index];
      const boardRect = boardElementRef.current?.getBoundingClientRect();
      if (!piece || !boardRect) {
        return;
      }

      const groupIndices = getConnectedGroupIndices(
        gridRef.current,
        index,
        measuresRef.current.totalSlots,
      );

      if (groupIndices.length === 0) {
        return;
      }

      const relativeGroup = groupIndices.map(
        (groupIndex) => groupIndex - index,
      );
      const anchorLeft = (index % COLS) * measuresRef.current.cellWidth;
      const anchorTop =
        Math.floor(index / COLS) * measuresRef.current.cellHeight;
      const localPointerX = pointerX - boardRect.left;
      const localPointerY = pointerY - boardRect.top;

      playSFX('bubbleIn');
      setSession((previousSession) => ({
        ...previousSession,
        activeDrag: {
          pieceId: piece.id,
          originIndex: index,
          groupOffsets: relativeGroup,
          pointerX: localPointerX,
          pointerY: localPointerY,
          offsetX: localPointerX - anchorLeft,
          offsetY: localPointerY - anchorTop,
          targetIndex: index,
        },
      }));
      setState((previousState) => ({
        ...previousState,
        status:
          previousState.status === GAME_LIFECYCLE_STATUS.IDLE
            ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
            : previousState.status,
      }));
    },
    [isComplete],
  );

  const activeGroupSlotIndexes = useMemo(() => {
    if (!session.activeDrag) {
      return [];
    }

    const { groupOffsets, originIndex } = session.activeDrag;
    return groupOffsets.map((offset) => originIndex + offset);
  }, [session.activeDrag]);

  const targetGroupSlotIndexes = useMemo(() => {
    if (!session.activeDrag) {
      return [];
    }

    const { groupOffsets, targetIndex } = session.activeDrag;
    return groupOffsets.map((offset) => targetIndex + offset);
  }, [session.activeDrag]);

  const hiddenPieceIds = useMemo(() => {
    if (!session.activeDrag) {
      return new Set<number>();
    }

    return new Set(
      activeGroupSlotIndexes
        .map((index) => session.grid[index]?.id)
        .filter((pieceId): pieceId is number => pieceId !== undefined),
    );
  }, [activeGroupSlotIndexes, session.activeDrag, session.grid]);

  const correctPieces = useMemo(
    () => countCorrectPieces(session.grid),
    [session.grid],
  );

  return {
    imageUrl,
    hearts: state.hearts,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    score: state.score,
    progress: state.progress,
    swapCount: state.swapCount,
    totalTime: state.timeElapsed,
    time: formatElapsedTime(state.timeElapsed),
    measures,
    boardRef,
    startDrag,
    grid: session.grid,
    activeDrag: session.activeDrag,
    activeGroupSlotIndexes,
    targetGroupSlotIndexes,
    hiddenPieceIds,
    getBorders: (index: number) =>
      getPieceBorders(index, session.grid, measures.totalSlots),
    correctPieces,
  };
}
