import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { useEffect, useMemo, useState } from 'react';
import type { DailyPanicoEntry } from 'types/games';
import { gameInfo } from '../info';
import { buildButtons } from './engine';
import { getProgress } from './helpers';
import type { GameState, SessionState } from './types';

const INITIAL_ACTIVE_BUTTON_INDEX = -1;

/**
 * Drives Panico's state machine: local persistence, sequence progression,
 * hearts, score/progress tracking, and win/lose transitions.
 *
 * @param data Today's Panico payload.
 * @param initialState Persisted or fresh game state.
 * @returns UI-ready state and actions for the Panico screen.
 */
export function usePanicoEngine(
  data: DailyPanicoEntry,
  initialState: GameState,
) {
  const buttons = useMemo(() => buildButtons(data.buttons), [data.buttons]);
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>({
    buttons,
    activeButtonIndex: INITIAL_ACTIVE_BUTTON_INDEX,
    status: 'idle',
  });
  const [showResults, setShowResults] = useState(false);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: initialState,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: only persisted state should trigger writes
  useEffect(() => {
    updateLocalStorage(state);
  }, [state]);

  useEffect(() => {
    setSession((previousSession) => ({
      ...previousSession,
      buttons,
    }));
  }, [buttons]);

  function onStart() {
    if (
      state.status === GAME_LIFECYCLE_STATUS.LOSE ||
      state.status === GAME_LIFECYCLE_STATUS.WIN
    ) {
      return;
    }

    playSFX('select');
    setSession((previousSession) => ({
      ...previousSession,
      activeButtonIndex: 0,
      status: 'ongoing',
    }));
    setState((previousState) => ({
      ...previousState,
      status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    }));
  }

  function onNextButton(isCorrect: boolean) {
    const nextActiveButtonIndex = session.activeButtonIndex + 1;

    if (isCorrect) {
      const isWin = nextActiveButtonIndex === state.totalButtons;
      const farthestButtonIndex = Math.max(
        state.farthestButtonIndex,
        nextActiveButtonIndex,
      );
      const heartsMultiplier = Math.max(1, state.hearts);

      if (isWin) {
        playSFX('win');
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      } else {
        playSFX('select');
      }

      setState((previousState) => ({
        ...previousState,
        status: isWin
          ? GAME_LIFECYCLE_STATUS.WIN
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
        farthestButtonIndex,
        progress: getProgress(farthestButtonIndex, previousState.totalButtons),
        score:
          previousState.score +
          heartsMultiplier * (isWin ? 10 : nextActiveButtonIndex),
      }));

      setSession((previousSession) => ({
        ...previousSession,
        activeButtonIndex: isWin
          ? previousSession.activeButtonIndex
          : nextActiveButtonIndex,
        status: isWin ? 'idle' : 'ongoing',
      }));
      return;
    }

    const hearts = state.hearts - 1;
    const isLose = hearts <= 0;
    const farthestButtonIndex = Math.max(
      state.farthestButtonIndex,
      session.activeButtonIndex,
      0,
    );

    if (isLose) {
      playSFX('lose');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
    } else {
      playSFX('drama');
    }

    setState((previousState) => ({
      ...previousState,
      status: isLose
        ? GAME_LIFECYCLE_STATUS.LOSE
        : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
      hearts,
      farthestButtonIndex,
      progress: getProgress(farthestButtonIndex, previousState.totalButtons),
    }));
    setSession((previousSession) => ({
      ...previousSession,
      activeButtonIndex: INITIAL_ACTIVE_BUTTON_INDEX,
      status: 'idle',
    }));
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useEffect(() => {
    if (isComplete) {
      setShowResults(true);
    }
  }, [isComplete]);

  return {
    hearts: state.hearts,
    totalButtons: state.totalButtons,
    farthestButtonIndex: state.farthestButtonIndex,
    score: state.score,
    progress: state.progress,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    activeButtonIndex: session.activeButtonIndex,
    sessionStatus: session.status,
    buttons: session.buttons,
    onStart,
    onNextButton,
  };
}
