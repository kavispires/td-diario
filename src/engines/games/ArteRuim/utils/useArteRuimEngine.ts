import { useAutoShowResults } from '@hooks/useAutoShowResults';
import { useDailyLocalToday } from '@hooks/useDailyLocalToday';
import {
  getGameAnalyticsEventName,
  logAnalyticsEvent,
} from '@services/firebase';

import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { getGameStatuses } from '@utils/helpers';
import {
  countSolvedLetterOccurrences,
  countSolvedLetters,
  countTotalLetterOccurrences,
  countTotalLetters,
  getLetterPoints,
  isGuessableCharacter,
  normalizeCharacter,
} from '@utils/prompts';
import { playSFX } from '@utils/soundEffects';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DailyArteRuimEntry } from 'types/games';
import { gameInfo } from '../info';
import { ARTE_RUIM_HEARTS, WIN_BONUS_SCORE } from './constants';
import { textHasNumbers } from './helpers';
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
  const allowNumbers = useMemo(() => textHasNumbers(data.text), [data.text]);

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
      const letter = normalizeCharacter(rawLetter);

      if (
        !isGuessableCharacter(letter, allowNumbers) ||
        state.guesses[letter] ||
        state.status === GAME_LIFECYCLE_STATUS.WIN ||
        state.status === GAME_LIFECYCLE_STATUS.LOSE
      ) {
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
      const totalLetterOccurrences = countTotalLetterOccurrences(
        data.text,
        allowNumbers,
      );
      const solvedLetterOccurrences = countSolvedLetterOccurrences(
        data.text,
        nextSolution,
        allowNumbers,
      );

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

      setState((previousState) => ({
        ...previousState,
        guesses: {
          ...previousState.guesses,
          [letter]: guess,
        },
        solution: nextSolution,
        hearts: nextHearts,
        status,
        score: isCorrect
          ? previousState.score +
            getLetterPoints(letter) * previousState.hearts +
            (isWin ? WIN_BONUS_SCORE : 0)
          : previousState.score,
        progress:
          totalLetterOccurrences > 0
            ? solvedLetterOccurrences / totalLetterOccurrences
            : previousState.progress,
      }));
    },
    [
      allowNumbers,
      data.text,
      state.guesses,
      state.hearts,
      state.solution,
      state.status,
    ],
  );

  const { isWin, isLose, isComplete } = getGameStatuses(state.status);

  useAutoShowResults(isComplete, setShowResults);

  const totalLetters = useMemo(
    () => countTotalLetters(state.solution),
    [state.solution],
  );
  const revealedLetters = useMemo(
    () => countSolvedLetters(state.solution),
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
    allowNumbers,
    showResults,
    setShowResults,
    isWin,
    isLose,
    isComplete,
    guessLetter,
  };
}
