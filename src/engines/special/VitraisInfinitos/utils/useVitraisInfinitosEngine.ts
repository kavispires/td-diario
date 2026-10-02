import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { useEffect, useMemo, useState } from 'react';
import type { DailyVitraisInfinitosEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  countCorrectPlacements,
  getProgress,
  getScore,
  moveConnectedGroup,
} from './helpers';
import type { GameState } from './types';

/**
 * Drives a single day's Vitrais Infinitos puzzle: connected-piece movement,
 * progress tracking, win detection, and local persistence so a reload keeps
 * the current arrangement of today's board.
 *
 * @param data - Today's Vitrais Infinitos challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Vitrais Infinitos screen needs to render,
 *   interact with, and reveal the finished results splash.
 */
export function useVitraisInfinitosEngine(
  data: DailyVitraisInfinitosEntry,
  initialState: GameState,
) {
  const [state, setState] = useState<GameState>(initialState);
  const [selectedAnchorIndex, setSelectedAnchorIndex] = useState<number | null>(
    null,
  );
  const [showResults, setShowResults] = useState(false);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useEffect(() => {
    if (isComplete) {
      setShowResults(true);
    }
  }, [isComplete]);

  function moveGroup(sourceAnchorIndex: number, targetAnchorIndex: number) {
    if (isComplete) {
      return;
    }

    const nextPieceOrder = moveConnectedGroup(
      state.pieceOrder,
      sourceAnchorIndex,
      targetAnchorIndex,
    );

    if (!nextPieceOrder) {
      playSFX('nah');
      return;
    }

    const solvedPieces = countCorrectPlacements(nextPieceOrder);
    const nextStatus =
      solvedPieces === data.pieces.length
        ? GAME_LIFECYCLE_STATUS.WIN
        : GAME_LIFECYCLE_STATUS.IN_PROGRESS;

    playSFX(nextStatus === GAME_LIFECYCLE_STATUS.WIN ? 'win' : 'swap');

    if (nextStatus === GAME_LIFECYCLE_STATUS.WIN && !isWin) {
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
    }

    setSelectedAnchorIndex(null);
    setState((prev) => ({
      ...prev,
      status: nextStatus,
      pieceOrder: nextPieceOrder,
      moveCount: prev.moveCount + 1,
      progress: getProgress(solvedPieces, data.pieces.length),
      score: getScore(solvedPieces),
    }));
  }

  function toggleSelection(index: number) {
    if (isComplete) {
      return;
    }

    setSelectedAnchorIndex((prev) => {
      const isDeselecting = prev === index;
      playSFX(isDeselecting ? 'bubbleOut' : 'select');
      return isDeselecting ? null : index;
    });
  }

  const solvedPieces = useMemo(
    () => countCorrectPlacements(state.pieceOrder),
    [state.pieceOrder],
  );

  return {
    pieceOrder: state.pieceOrder,
    moveCount: state.moveCount,
    score: state.score,
    progress: state.progress,
    solvedPieces,
    selectedAnchorIndex,
    setSelectedAnchorIndex,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    moveGroup,
    toggleSelection,
  };
}
