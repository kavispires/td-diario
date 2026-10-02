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
import { playSFX } from '@utils/soundEffects';
import { useEffect, useState } from 'react';
import type { DailyFilmacoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  countSolvedLetters,
  countTotalLetters,
  isGuessableFilmacoCharacter,
  normalizeFilmacoCharacter,
} from './helpers';
import type { FilmacoEngineState, GameState, LetterState } from './types';

const CORRECT_GUESS_SCORE = 5;
const WIN_BONUS_SCORE = 10;

/**
 * Drives a single day's Filmaco game: letter-guessing logic, hearts,
 * win/lose detection, and local persistence across reloads.
 *
 * @param data - Today's Filmaco challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Filmaco screen needs to render and interact with
 *   the prompt, keyboard, and results splash.
 */
export function useFilmacoEngine(
  data: DailyFilmacoEntry,
  initialState: GameState,
): FilmacoEngineState {
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

  /**
   * Commits one guessed letter/digit from the on-screen or physical
   * keyboard, updating hearts, score, solution progress, and lifecycle.
   *
   * @param letter - Raw guessed character.
   */
  function guessLetter(letter: string) {
    const normalizedLetter = normalizeFilmacoCharacter(letter);

    if (
      !isGuessableFilmacoCharacter(normalizedLetter, true) ||
      state.guesses[normalizedLetter] ||
      state.status === GAME_LIFECYCLE_STATUS.WIN ||
      state.status === GAME_LIFECYCLE_STATUS.LOSE
    ) {
      return;
    }

    const isCorrect = state.solution[normalizedLetter] !== undefined;
    const nextSolution = isCorrect
      ? {
          ...state.solution,
          [normalizedLetter]: true,
        }
      : state.solution;
    const isWin =
      isCorrect && Object.values(nextSolution).every((value) => value);
    const isLose = !isCorrect && state.hearts === 1;
    const nextLetterState: LetterState = isCorrect ? 'correct' : 'incorrect';
    const solvedLetters = isCorrect
      ? countSolvedLetters(nextSolution)
      : countSolvedLetters(state.solution);
    const totalLetters = countTotalLetters(state.solution);

    if (isCorrect) {
      playSFX(isWin ? 'win' : 'addCorrect');
      if (isWin) {
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.id, 'win'));
      }
    } else {
      playSFX(isLose ? 'lose' : 'addWrong');
      if (isLose) {
        logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.id, 'lose'));
      }
    }

    setState((previousState) => ({
      ...previousState,
      guesses: {
        ...previousState.guesses,
        [normalizedLetter]: {
          letter: normalizedLetter,
          state: nextLetterState,
          disabled: true,
        },
      },
      solution: nextSolution,
      hearts: isCorrect ? previousState.hearts : previousState.hearts - 1,
      status: isWin
        ? GAME_LIFECYCLE_STATUS.WIN
        : isLose
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS,
      progress:
        totalLetters > 0
          ? solvedLetters / totalLetters
          : previousState.progress,
      score: isCorrect
        ? previousState.score +
          previousState.hearts * (isWin ? WIN_BONUS_SCORE : CORRECT_GUESS_SCORE)
        : previousState.score,
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
    guesses: state.guesses,
    solution: state.solution,
    showResults,
    setShowResults,
    progress: state.progress,
    score: state.score,
    isWin,
    isLose,
    isComplete,
    guessLetter,
  };
}
