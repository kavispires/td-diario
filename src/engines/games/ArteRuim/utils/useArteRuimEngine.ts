import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import { playSFX } from '@utils/soundEffects';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DailyArteRuimEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  ARTE_RUIM_HEARTS,
  countLetterOccurrences,
  countRevealedLetters,
  getProgress,
  normalizeLetter,
} from './helpers';
import type { ArteRuimEngineState, GameState, LetterGuess } from './types';

/**
 * Drives a single day's Arte Ruim game: guess validation, heart loss,
 * win/lose detection, scoring, and local persistence.
 *
 * @param data - Today's Arte Ruim challenge payload.
 * @param initialState - The engine's starting `GameState`, usually loaded
 *   via {@link getInitialState}.
 * @returns Everything the Arte Ruim screen needs to render and interact
 *   with today's challenge.
 */
export function useArteRuimEngine(
  data: DailyArteRuimEntry,
  initialState: GameState,
): ArteRuimEngineState {
  const [state, setState] = useState<GameState>(initialState);
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

  const guessLetter = useCallback(
    (rawLetter: string) => {
      const letter = normalizeLetter(rawLetter);

      if (!/^[a-z]$/.test(letter) || state.guesses[letter]) {
        return;
      }

      const isCorrect = state.solution[letter] !== undefined;
      const nextSolution = isCorrect
        ? { ...state.solution, [letter]: true }
        : state.solution;
      const nextHearts = isCorrect ? state.hearts : state.hearts - 1;
      const isWin = Object.values(nextSolution).every(Boolean);
      const isLose = !isCorrect && nextHearts <= 0;
      const status = isWin
        ? GAME_LIFECYCLE_STATUS.WIN
        : isLose
          ? GAME_LIFECYCLE_STATUS.LOSE
          : GAME_LIFECYCLE_STATUS.IN_PROGRESS;
      const guess: LetterGuess = {
        letter,
        state: isCorrect ? 'correct' : 'incorrect',
        disabled: true,
      };

      if (isCorrect) {
        playSFX(isWin ? 'win' : 'addCorrect');
        if (isWin) {
          logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'win'));
        }
      } else {
        playSFX(isLose ? 'lose' : 'addWrong');
        if (isLose) {
          logAnalyticsEvent(getGameAnalyticsEventName(gameInfo.key, 'lose'));
        }
      }

      setState((previousState) => {
        const revealedOccurrences = isCorrect
          ? countLetterOccurrences(data.text, letter)
          : 0;
        const score = isCorrect
          ? previousState.score + revealedOccurrences * previousState.hearts
          : previousState.score;

        return {
          ...previousState,
          guesses: {
            ...previousState.guesses,
            [letter]: guess,
          },
          solution: nextSolution,
          hearts: nextHearts,
          status,
          score,
          progress: isCorrect
            ? getProgress(nextSolution)
            : previousState.progress,
        };
      });
    },
    [data.text, state.guesses, state.hearts, state.solution],
  );

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useEffect(() => {
    if (isComplete) {
      setShowResults(true);
    }
  }, [isComplete]);

  const totalLetters = useMemo(
    () => Object.keys(state.solution).length,
    [state.solution],
  );
  const revealedLetters = useMemo(
    () => countRevealedLetters(state.solution),
    [state.solution],
  );

  return {
    hearts: state.hearts,
    guesses: state.guesses,
    solution: state.solution,
    totalLetters,
    revealedLetters,
    wrongGuesses: ARTE_RUIM_HEARTS - state.hearts,
    score: state.score,
    progress: state.progress,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    guessLetter,
  };
}
