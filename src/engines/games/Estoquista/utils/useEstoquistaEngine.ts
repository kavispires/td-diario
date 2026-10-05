import { useAutoShowResults } from '@hooks/useAutoShowResults';
import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';

import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { notification } from '@utils/notification';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useEffect, useRef, useState } from 'react';
import type { DailyEstoquistaEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  ESTOQUISTA_COMPLETE_PROGRESS,
  ESTOQUISTA_FINAL_SCORE_MULTIPLIER,
  ESTOQUISTA_HEART_PENALTY,
  ESTOQUISTA_LAST_GOOD_HIGHLIGHT_DELAY,
  ESTOQUISTA_PHASE,
  ESTOQUISTA_PHASE_TRANSITION_DELAY,
} from './constants';
import {
  getGuessString,
  getPlacedGoodsCount,
  getRequiredFulfillmentCount,
  getResetState,
  getTotalHearts,
  getTotalProgressSteps,
  validateAttempts,
} from './helpers';
import type { EstoquistaEngineState, GameState, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  activeOrder: null,
};

/**
 * Drives a single day's Estoquista game: warehouse stocking, order
 * assignments, submission validation, hearts, restart handling, and local
 * persistence.
 *
 * @param data - Today's Estoquista payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Estoquista screen needs to render and play.
 */
export function useEstoquistaEngine(
  data: DailyEstoquistaEntry,
  initialState: GameState,
): EstoquistaEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
  const [showResults, setShowResults] = useState(false);
  const totalHearts = getTotalHearts(data);
  const totalProgressSteps = getTotalProgressSteps(data);
  const pendingTimeouts = useRef<number[]>([]);
  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  function clearPendingTimeouts() {
    for (const timeoutId of pendingTimeouts.current) {
      window.clearTimeout(timeoutId);
    }
    pendingTimeouts.current = [];
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup only, must run once on unmount
  useEffect(() => clearPendingTimeouts, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);
  const currentGood = data.goods[getPlacedGoodsCount(state.warehouse)] ?? null;

  function updateSession(next: Partial<SessionState>) {
    setSession((prev) => ({ ...prev, ...next }));
  }

  function onPlaceGood(shelfIndex: number) {
    if (
      isComplete ||
      state.phase !== ESTOQUISTA_PHASE.STOCKING ||
      !currentGood ||
      state.warehouse[shelfIndex]
    ) {
      return;
    }

    const warehouse = [...state.warehouse];
    warehouse[shelfIndex] = currentGood;
    const placedGoods = getPlacedGoodsCount(warehouse);
    const isLastGood = placedGoods === data.goods.length;

    playSFX('swap');
    setState({
      ...state,
      status:
        state.status === GAME_LIFECYCLE_STATUS.IDLE
          ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
          : state.status,
      warehouse,
      lastPlacedGoodId: currentGood,
      phase: ESTOQUISTA_PHASE.STOCKING,
      progress: placedGoods / totalProgressSteps,
    });

    if (isLastGood) {
      clearPendingTimeouts();
      const morphTimeout = window.setTimeout(() => {
        setState((prev) => ({ ...prev, lastPlacedGoodId: null }));
      }, ESTOQUISTA_LAST_GOOD_HIGHLIGHT_DELAY);
      const advancePhaseTimeout = window.setTimeout(() => {
        setState((prev) => ({ ...prev, phase: ESTOQUISTA_PHASE.FULFILLING }));
      }, ESTOQUISTA_PHASE_TRANSITION_DELAY);
      pendingTimeouts.current.push(morphTimeout, advancePhaseTimeout);
    }
  }

  function onSelectOrder(order: string) {
    if (
      isComplete ||
      state.phase !== ESTOQUISTA_PHASE.FULFILLING ||
      state.fulfillments.some((fulfillment) => fulfillment.order === order)
    ) {
      return;
    }

    if (session.activeOrder === order) {
      playSFX('bubbleOut');
      updateSession({ activeOrder: null });
      return;
    }

    playSFX('bubbleIn');
    updateSession({ activeOrder: order });
  }

  function onFulfill(shelfIndex: number, order?: string) {
    const targetOrder = order ?? session.activeOrder;

    const existingFulfillment = state.fulfillments.find(
      (fulfillment) => fulfillment.order === targetOrder,
    );
    const isShelfTakenByAnotherOrder = state.fulfillments.some(
      (fulfillment) =>
        fulfillment.shelfIndex === shelfIndex &&
        fulfillment.order !== targetOrder,
    );
    const isNewPlacement = !existingFulfillment;

    if (
      isComplete ||
      state.phase !== ESTOQUISTA_PHASE.FULFILLING ||
      !targetOrder ||
      existingFulfillment?.shelfIndex === shelfIndex ||
      isShelfTakenByAnotherOrder ||
      (isNewPlacement &&
        state.fulfillments.length >= getRequiredFulfillmentCount(data))
    ) {
      return;
    }

    const fulfillments = [
      ...state.fulfillments.filter(
        (fulfillment) => fulfillment.order !== targetOrder,
      ),
      {
        order: targetOrder,
        shelfIndex,
      },
    ];

    playSFX('swap');
    setState({
      ...state,
      status:
        state.status === GAME_LIFECYCLE_STATUS.IDLE
          ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
          : state.status,
      fulfillments,
      progress: (data.goods.length + fulfillments.length) / totalProgressSteps,
    });
    updateSession({ activeOrder: null });
  }

  function onTakeBack(orderId: string) {
    if (isComplete || state.phase !== ESTOQUISTA_PHASE.FULFILLING) {
      return;
    }

    const fulfillments = state.fulfillments.filter(
      (fulfillment) => fulfillment.order !== orderId,
    );

    if (fulfillments.length === state.fulfillments.length) {
      return;
    }

    playSFX('bubbleOut');
    setState({
      ...state,
      fulfillments,
      progress: (data.goods.length + fulfillments.length) / totalProgressSteps,
    });
    updateSession({ activeOrder: null });
  }

  function onSubmit() {
    if (isComplete || state.phase !== ESTOQUISTA_PHASE.FULFILLING) {
      return;
    }

    if (state.fulfillments.length !== getRequiredFulfillmentCount(data)) {
      notification.info(
        'Ainda falta posicionar os pedidos nas prateleiras certas.',
      );
      return;
    }

    const guessString = getGuessString(state.fulfillments);
    if (state.guesses.includes(guessString)) {
      playSFX('nah');
      notification.warning(
        'Você já tentou essa combinação. Experimente outra organização.',
      );
      return;
    }

    const attemptResult = validateAttempts(
      data.orders,
      state.warehouse,
      state.fulfillments,
    );
    const allCorrect = attemptResult.every(Boolean);
    const hearts = allCorrect
      ? state.hearts
      : Math.max(state.hearts - ESTOQUISTA_HEART_PENALTY, 0);
    const isGameOver = allCorrect || hearts === 0;
    const correctCount = attemptResult.filter(Boolean).length;

    if (allCorrect) {
      playSFX('win');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
    } else if (hearts === 0) {
      playSFX('lose');
      vibrate('lose');
      notification.error('Esse foi o último coração. Tente de novo amanhã!');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
    } else {
      playSFX('wrong');
      vibrate('wrong');
      notification.warning(
        'Um ou mais pedidos foram para o lugar errado. Ajuste e tente outra vez.',
      );
    }

    setState({
      ...state,
      hearts,
      status: allCorrect
        ? GAME_LIFECYCLE_STATUS.WIN
        : hearts === 0
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
      evaluations: [...state.evaluations, attemptResult],
      guesses: [...state.guesses, guessString],
      progress: allCorrect ? ESTOQUISTA_COMPLETE_PROGRESS : state.progress,
      score: isGameOver
        ? ESTOQUISTA_FINAL_SCORE_MULTIPLIER * hearts * correctCount
        : state.score,
    });
    updateSession({ activeOrder: null });
  }

  function reset() {
    if (isComplete || state.hearts <= ESTOQUISTA_HEART_PENALTY) {
      return;
    }

    clearPendingTimeouts();
    playSFX('shuffle');
    setState(
      getResetState(data, state.extraAttempts + ESTOQUISTA_HEART_PENALTY),
    );
    setShowResults(false);
    setSession(INITIAL_SESSION);
  }

  useAutoShowResults(isComplete, setShowResults);

  return {
    hearts: state.hearts,
    totalHearts,
    phase: state.phase,
    warehouse: state.warehouse,
    fulfillments: state.fulfillments,
    lastPlacedGoodId: state.lastPlacedGoodId,
    activeOrder: session.activeOrder,
    evaluations: state.evaluations,
    currentGood,
    showResults,
    setShowResults,
    progress: state.progress,
    score: state.score,
    isWin,
    isLose,
    isComplete,
    onPlaceGood,
    onSelectOrder,
    onFulfill,
    onTakeBack,
    onSubmit,
    reset,
  };
}
