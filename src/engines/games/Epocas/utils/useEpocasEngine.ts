import { useAutoShowResults } from '@hooks/useAutoShowResults';
import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import { recordGameCompletion } from '@services/dailyUser';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { vibrate } from '@utils/vibrate';
import { useEffect, useMemo, useState } from 'react';
import type { DailyEpocasEntry } from 'types/games';
import { gameInfo } from '../info';
import { CORRECT_POSITION_SCORE, WIN_BONUS_SCORE } from './constants';
import {
  countCorrectPositions,
  getSortedIndexes,
  movePosition,
  swapPositions,
} from './helpers';
import type { EpocasEngineState, GameState, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  selectedIndex: null,
  latestAttempt: 0,
};

/**
 * Drives a single day's Épocas game: reordering the timeline, verifying
 * it, remaining-heart tracking, win/lose detection, and per-day
 * persistence.
 *
 * @param data - Today's Épocas challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via `getInitialState`.
 * @returns Everything the Épocas screen needs to render and interact with
 *   today's timeline.
 */
export function useEpocasEngine(
  data: DailyEpocasEntry,
  initialState: GameState,
): EpocasEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
  const [showResults, setShowResults] = useState(false);

  const sortedIndexes = useMemo(
    () => getSortedIndexes(data.events),
    [data.events],
  );

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only state is meant to trigger persistence
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  function updateSession(next: Partial<SessionState>) {
    setSession((prev) => ({ ...prev, ...next }));
  }

  function isComplete() {
    return getGameStatuses(state.status).isComplete;
  }

  function onSwap(fromIndex: number, toIndex: number) {
    if (isComplete() || fromIndex === toIndex) {
      return;
    }

    setState((prev) => ({
      ...prev,
      order: swapPositions(prev.order, fromIndex, toIndex),
    }));
    updateSession({ selectedIndex: null });
    playSFX('swap');
  }

  function onMove(fromIndex: number, toGapIndex: number) {
    if (isComplete()) {
      return;
    }

    const nextOrder = movePosition(state.order, fromIndex, toGapIndex);
    if (nextOrder === state.order) {
      return;
    }

    setState((prev) => ({ ...prev, order: nextOrder }));
    updateSession({ selectedIndex: null });
    playSFX('swap');
  }

  function onSelectForSwap(index: number) {
    if (isComplete()) {
      return;
    }

    if (session.selectedIndex === null) {
      updateSession({ selectedIndex: index });
      playSFX('select');
      return;
    }

    if (session.selectedIndex === index) {
      updateSession({ selectedIndex: null });
      return;
    }

    onSwap(session.selectedIndex, index);
  }

  function onVerify() {
    if (isComplete()) {
      return;
    }

    const correctCount = countCorrectPositions(state.order, sortedIndexes);
    const isWin = correctCount === data.events.length;
    const bestProgress = Math.max(
      state.progress,
      correctCount / data.events.length,
    );

    if (isWin) {
      const score =
        correctCount * CORRECT_POSITION_SCORE * state.hearts + WIN_BONUS_SCORE;
      playSFX('win');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      recordGameCompletion(gameInfo.key, 'win', state.cloudSynced, () =>
        updateLocalStorage({ cloudSynced: true }),
      );

      setState((prev) => ({
        ...prev,
        status: GAME_LIFECYCLE_STATUS.WIN,
        attempts: [...prev.attempts, correctCount],
        score,
        progress: 1,
      }));
      return;
    }

    const hearts = state.hearts - 1;
    const isLose = hearts <= 0;
    playSFX(isLose ? 'lose' : 'wrong');
    vibrate(isLose ? 'lose' : 'wrong');

    if (isLose) {
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
      recordGameCompletion(gameInfo.key, 'lose', state.cloudSynced, () =>
        updateLocalStorage({ cloudSynced: true }),
      );
    }

    setState((prev) => ({
      ...prev,
      status: isLose
        ? GAME_LIFECYCLE_STATUS.LOSE
        : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
      hearts,
      attempts: [...prev.attempts, correctCount],
      progress: bestProgress,
    }));
    updateSession({ selectedIndex: null, latestAttempt: Date.now() });
  }

  const {
    isWin,
    isLose,
    isComplete: isCompleteStatus,
  } = getGameStatuses(state.status);

  useAutoShowResults(isCompleteStatus, setShowResults);

  return {
    hearts: state.hearts,
    order: state.order,
    attempts: state.attempts,
    selectedIndex: session.selectedIndex,
    latestAttempt: session.latestAttempt,
    score: state.score,
    progress: state.progress,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete: isCompleteStatus,
    onSwap,
    onMove,
    onSelectForSwap,
    onVerify,
  };
}
