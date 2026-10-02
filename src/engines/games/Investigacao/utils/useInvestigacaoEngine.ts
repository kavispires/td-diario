import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { useEffect, useMemo, useState } from 'react';
import type { DailyInvestigacaoEntry } from 'types/games';
import { gameInfo } from '../info';
import { getProgress, getScore, getVisibleStatements } from './helpers';
import type { GameState, InvestigacaoEngineState, SessionState } from './types';

const INITIAL_SESSION: SessionState = {
  activeSuspectId: null,
};

/**
 * Drives a single day's Investigação game: extra-clue spending, suspect
 * selection/release logic, win/lose transitions, and local persistence.
 *
 * @param data - Today's Investigação challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Investigação screen needs to render and play the case.
 */
export function useInvestigacaoEngine(
  data: DailyInvestigacaoEntry,
  initialState: GameState,
): InvestigacaoEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [session, setSession] = useState<SessionState>(INITIAL_SESSION);
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

  function updateSession(next: Partial<SessionState>) {
    setSession((previousSession) => ({ ...previousSession, ...next }));
  }

  function onNeedClue() {
    if (state.hearts <= 0 || state.status === GAME_LIFECYCLE_STATUS.LOSE) {
      return;
    }

    playSFX('swap');
    setState((previousState) => {
      const nextHearts = previousState.hearts - 1;
      return {
        ...previousState,
        hearts: nextHearts,
        status:
          previousState.status === GAME_LIFECYCLE_STATUS.IDLE
            ? GAME_LIFECYCLE_STATUS.IN_PROGRESS
            : previousState.status,
        score: getScore(
          previousState.released.length,
          nextHearts,
          previousState.status === GAME_LIFECYCLE_STATUS.WIN,
        ),
      };
    });
  }

  function onDeselectSuspect() {
    updateSession({ activeSuspectId: null });
  }

  function onSelectSuspect(suspectId: string) {
    if (
      state.released.includes(suspectId) ||
      state.status === GAME_LIFECYCLE_STATUS.WIN ||
      state.status === GAME_LIFECYCLE_STATUS.LOSE
    ) {
      return;
    }

    playSFX('uh');
    updateSession({ activeSuspectId: suspectId });
  }

  function onRelease() {
    const suspectId = session.activeSuspectId;
    if (!suspectId) {
      return;
    }

    if (suspectId === data.culpritId) {
      playSFX('drama');
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
      setState((previousState) => ({
        ...previousState,
        hearts: 0,
        status: GAME_LIFECYCLE_STATUS.LOSE,
        score: getScore(previousState.released.length, 0, false),
      }));
      updateSession({ activeSuspectId: null });
      return;
    }

    setState((previousState) => {
      const nextReleased = [...previousState.released, suspectId];
      const isWin = nextReleased.length === data.suspects.length - 1;

      if (isWin) {
        playSFX('win');
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
      } else {
        playSFX('wee');
      }

      return {
        ...previousState,
        released: nextReleased,
        status: isWin
          ? GAME_LIFECYCLE_STATUS.WIN
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
        progress: getProgress(nextReleased.length, data.suspects.length),
        score: getScore(nextReleased.length, previousState.hearts, isWin),
      };
    });
    updateSession({ activeSuspectId: null });
  }

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  const { visibleStatements, visibleAdditionalStatements } = useMemo(
    () =>
      getVisibleStatements({
        statements: data.statements,
        additionalStatements: data.additionalStatements,
        releasedCount: state.released.length,
        hearts: state.hearts,
        isComplete,
      }),
    [
      data.additionalStatements,
      data.statements,
      isComplete,
      state.hearts,
      state.released.length,
    ],
  );

  useEffect(() => {
    if (isComplete) {
      setShowResults(true);
    }
  }, [isComplete]);

  return {
    hearts: state.hearts,
    released: state.released,
    activeSuspectId: session.activeSuspectId,
    showResults,
    setShowResults,
    visibleStatements,
    visibleAdditionalStatements,
    score: state.score,
    isWin,
    isLose,
    isComplete,
    onNeedClue,
    onSelectSuspect,
    onDeselectSuspect,
    onRelease,
  };
}
