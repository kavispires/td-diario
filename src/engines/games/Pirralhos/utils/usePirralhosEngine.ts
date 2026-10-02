import {
  gameIdToLocalTodayKey,
  useDailyLocalToday,
} from '@hooks/useDailyLocalToday';
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
import type { DailyPirralhosEntry } from 'types/games';
import { gameInfo } from '../info';
import { getProgress, getWinScore } from './helpers';
import type { GameState, PirralhosEngineState } from './types';

const ASSESSMENT_ORDER = ['liar', 'innocent', 'culprit', 'unknown'] as const;

/**
 * Drives a single day's Pirralhos game: accusation attempts, note markers,
 * win/lose detection, and local persistence so a reload preserves today's
 * investigation.
 *
 * @param data - Today's Pirralhos payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Pirralhos screen needs to render, take notes, and
 *   resolve the culprit.
 */
export function usePirralhosEngine(
  data: DailyPirralhosEntry,
  initialState: GameState,
): PirralhosEngineState {
  const [state, setState] = useState<GameState>(initialState);
  const [showResults, setShowResults] = useState(false);

  const { updateLocalStorage } = useDailyLocalToday<GameState>({
    key: gameIdToLocalTodayKey(gameInfo.id),
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

  /**
   * Cycles a kid's note marker through liar, innocent, culprit, and unknown.
   *
   * @param kidId - Kid id to update.
   */
  function assessKid(kidId: string) {
    playSFX('select');

    setState((previousState) => {
      const currentAssessment = previousState.assessments[kidId] ?? 'unknown';
      const currentIndex = ASSESSMENT_ORDER.indexOf(currentAssessment);
      const nextAssessment =
        ASSESSMENT_ORDER[(currentIndex + 1) % ASSESSMENT_ORDER.length];

      return {
        ...previousState,
        assessments: {
          ...previousState.assessments,
          [kidId]: nextAssessment,
        },
      };
    });
  }

  /**
   * Clears every note marker back to `unknown`.
   */
  function resetAssessments() {
    playSFX('bubbleOut');

    setState((previousState) => ({
      ...previousState,
      assessments: Object.fromEntries(
        Object.keys(previousState.assessments).map((kidId) => [
          kidId,
          'unknown' as const,
        ]),
      ) as Dictionary<'unknown'>,
    }));
  }

  /**
   * Accuses one kid and updates hearts, progress, score, and lifecycle
   * status. Repeat accusations are rejected with a warning toast.
   *
   * @param kidId - Kid id being accused.
   * @returns `true` when the accusation was accepted, otherwise `false`.
   */
  function submitKid(kidId: string): boolean {
    if (state.guesses.includes(kidId)) {
      playSFX('wrong');
      notification.warning(
        'Você já acusou esse pirralho e não foi ele(a)!',
        5000,
      );
      return false;
    }

    const isCulprit = data.culpritId === kidId;
    const guesses = [...state.guesses, kidId];

    if (isCulprit) {
      playSFX('win');
      if (!isWin) {
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.id, 'win'));
      }

      setState((previousState) => ({
        ...previousState,
        guesses,
        status: GAME_LIFECYCLE_STATUS.WIN,
        progress: getProgress(guesses.length, true),
        score: getWinScore(previousState.hearts, data.kids.length),
      }));
      return true;
    }

    notification.warning('Esse pirralho não é o culpado!', 5000);
    const hearts = state.hearts - 1;
    const didLose = hearts <= 0;

    playSFX(didLose ? 'lose' : 'wrong');
    vibrate(didLose ? 'lose' : 'wrong');

    if (didLose && !isLose) {
      logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.id, 'lose'));
    }

    setState((previousState) => ({
      ...previousState,
      hearts,
      guesses,
      status: didLose
        ? GAME_LIFECYCLE_STATUS.LOSE
        : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
      progress: getProgress(guesses.length, false),
      score: 0,
    }));

    return true;
  }

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    assessments: state.assessments,
    showResults,
    setShowResults,
    progress: state.progress,
    score: state.score,
    isWin,
    isLose,
    isComplete,
    assessKid,
    resetAssessments,
    submitKid,
  };
}
