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
import { useEffect, useState } from 'react';
import type { DailyEstoquistaEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  getGuessString,
  getPlacedGoodsCount,
  getResetState,
  getTotalHearts,
  getTotalProgressSteps,
  validateAttempts,
} from './helpers';
import {
  ESTOQUISTA_PHASE,
  type EstoquistaEngineState,
  type GameState,
  type SessionState,
} from './types';

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

    playSFX('swap');
    setState({
      ...state,
      status:
        state.status === GAME_LIFECYCLE_STATUS.IDLE
          ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
          : state.status,
      warehouse,
      lastPlacedGoodId: currentGood,
      phase:
        placedGoods === data.goods.length
          ? ESTOQUISTA_PHASE.FULFILLING
          : ESTOQUISTA_PHASE.STOCKING,
      score: state.score + 1,
      progress: placedGoods / totalProgressSteps,
    });
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

  function onFulfill(shelfIndex: number) {
    if (
      isComplete ||
      state.phase !== ESTOQUISTA_PHASE.FULFILLING ||
      !session.activeOrder ||
      state.fulfillments.some(
        (fulfillment) => fulfillment.order === session.activeOrder,
      ) ||
      state.fulfillments.some(
        (fulfillment) => fulfillment.shelfIndex === shelfIndex,
      )
    ) {
      return;
    }

    const fulfillments = [
      ...state.fulfillments,
      {
        order: session.activeOrder,
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
    updateSession({ activeOrder: orderId });
  }

  function onSubmit() {
    if (isComplete || state.phase !== ESTOQUISTA_PHASE.FULFILLING) {
      return;
    }

    if (state.fulfillments.length !== data.orders.length) {
      notification.info(
        'Ainda falta posicionar todos os pedidos, incluindo o item fora de estoque.',
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
    const hearts = allCorrect ? state.hearts : Math.max(state.hearts - 1, 0);

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
      progress: allCorrect ? 1 : state.progress,
      score: allCorrect ? state.score + state.hearts * 25 : state.score,
    });
    updateSession({ activeOrder: null });
  }

  function reset() {
    if (isComplete || state.hearts <= 1) {
      return;
    }

    playSFX('shuffle');
    setState(getResetState(data, state.extraAttempts + 1));
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
