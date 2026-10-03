import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import {
  getLettersInWord,
  isGuessableCharacter,
  normalizeCharacter,
} from '@utils/prompts';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyFilmacoEntry } from 'types/games';
import { gameInfo } from '../info';
import { FILMACO_HEARTS } from './constants';
import type { GameState, LetterGuess, LettersDictionary } from './types';

/**
 * Counts every guessable character occurrence in today's movie title,
 * including repeats (e.g. a title with three `"a"`s counts as three, not
 * one), used to compute Filmaco's letter-by-letter progress.
 *
 * @param title - Today's movie title (or double-feature titles).
 * @returns Total number of guessable character occurrences in `title`.
 */
export function countTotalLetterOccurrences(title: string): number {
  let total = 0;

  for (const character of title) {
    if (isGuessableCharacter(character, true)) {
      total += 1;
    }
  }

  return total;
}

/**
 * Counts how many guessable character occurrences in today's movie title
 * have already been solved, including repeats of the same letter/digit.
 *
 * @param title - Today's movie title (or double-feature titles).
 * @param solution - Normalized solution map for today's prompt.
 * @returns Number of solved character occurrences in `title`.
 */
export function countSolvedLetterOccurrences(
  title: string,
  solution: Dictionary<boolean>,
): number {
  let solved = 0;

  for (const character of title) {
    if (
      isGuessableCharacter(character, true) &&
      solution[normalizeCharacter(character)]
    ) {
      solved += 1;
    }
  }

  return solved;
}

/**
 * Builds the default `GameState` for a fresh Filmaco day.
 *
 * @param data - Today's Filmaco payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyFilmacoEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IN_PROGRESS,
    hearts: FILMACO_HEARTS,
    solution: getLettersInWord(data.title, true),
    guesses: {},
    progress: 0,
    score: 0,
  };
}

/**
 * Validates one restored guess entry from local storage.
 *
 * @param guess - Unknown restored value for one keyboard key.
 * @returns Whether the guess entry matches Filmaco's stored shape.
 */
function isValidGuess(guess: unknown): guess is LetterGuess {
  if (!guess || typeof guess !== 'object') {
    return false;
  }

  const value = guess as Partial<LetterGuess>;
  return (
    typeof value.letter === 'string' &&
    (value.state === 'correct' || value.state === 'incorrect') &&
    typeof value.disabled === 'boolean'
  );
}

/**
 * Validates the restored on-screen keyboard dictionary.
 *
 * @param guesses - Unknown restored guesses value.
 * @returns Whether every stored guess matches Filmaco's expected shape.
 */
function isValidGuessesDictionary(
  guesses: unknown,
): guesses is LettersDictionary {
  if (!guesses || typeof guesses !== 'object' || Array.isArray(guesses)) {
    return false;
  }

  return Object.entries(guesses).every(
    ([key, guess]) => isValidGuess(guess) && guess.letter === key,
  );
}

/**
 * Checks whether a restored solution map still matches today's title.
 *
 * @param restoredSolution - Solution restored from local storage.
 * @param expectedSolution - Fresh solution map derived from today's title.
 * @returns Whether both maps describe the same set of characters.
 */
function hasMatchingSolutionShape(
  restoredSolution: Dictionary<boolean>,
  expectedSolution: Dictionary<boolean>,
): boolean {
  const restoredKeys = Object.keys(restoredSolution).sort();
  const expectedKeys = Object.keys(expectedSolution).sort();

  if (restoredKeys.length !== expectedKeys.length) {
    return false;
  }

  return restoredKeys.every((key, index) => key === expectedKeys[index]);
}

/**
 * Validates that a restored Filmaco state still matches today's title and
 * keeps a coherent number of hearts, guesses, and solved characters.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Filmaco payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyFilmacoEntry): boolean {
  const expectedSolution = getLettersInWord(data.title, true);
  const validStatuses = Object.values(GAME_LIFECYCLE_STATUS);

  return (
    validStatuses.includes(state.status) &&
    state.hearts >= 0 &&
    state.hearts <= FILMACO_HEARTS &&
    hasMatchingSolutionShape(state.solution, expectedSolution) &&
    isValidGuessesDictionary(state.guesses) &&
    state.progress >= 0 &&
    state.progress <= 1 &&
    state.score >= 0
  );
}

/**
 * Retrieves today's Filmaco state, restoring it from local storage when it
 * still matches today's entry, or rebuilding a fresh state otherwise.
 *
 * @param data - Today's Filmaco payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyFilmacoEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Builds the plain-text shareable result for today's Filmaco run.
 *
 * @param options - Today's challenge number and solved-letter progress.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
  solvedLetters,
  totalLetters,
}: {
  challengeNumber: number;
  hearts: number;
  solvedLetters: number;
  totalLetters: number;
}): string {
  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: FILMACO_HEARTS,
    remainingHearts: hearts,
    heartsSuffix: `(${Math.round((solvedLetters / totalLetters) * 100)}%)`,
  });
}
