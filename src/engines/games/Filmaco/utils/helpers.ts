import {
  gameIdToLocalTodayKey,
  loadLocalToday,
} from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyFilmacoEntry } from 'types/games';
import { gameInfo } from '../info';
import type { GameState, LetterGuess, LettersDictionary } from './types';

/**
 * Number of wrong guesses Filmaco allows before ending the puzzle.
 */
export const FILMACO_HEARTS = 3;

/**
 * Removes accents and normalizes a guessed character to lowercase so the
 * keyboard can match accented movie titles with plain latin letters.
 *
 * @param character - Raw character from the title or keyboard.
 * @returns The normalized character.
 */
export function normalizeFilmacoCharacter(character: string): string {
  return character
    .normalize('NFD')
    .replaceAll(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Determines whether a title character should be guessed in Filmaco.
 *
 * @param character - Raw character from the movie title.
 * @param allowNumbers - Whether digits should count as guessable too.
 * @returns Whether the character belongs to the guessable alphabet.
 */
export function isGuessableFilmacoCharacter(
  character: string,
  allowNumbers = false,
): boolean {
  const normalizedCharacter = normalizeFilmacoCharacter(character);
  return allowNumbers
    ? /^[a-z0-9]$/i.test(normalizedCharacter)
    : /^[a-z]$/i.test(normalizedCharacter);
}

/**
 * Extracts the normalized set of unique letters/digits present in a movie
 * title, initializing each one as not yet discovered.
 *
 * @param text - Movie title shown in today's Filmaco challenge.
 * @param allowNumbers - Whether digits should count as guessable too.
 * @returns A normalized solution map keyed by unique character.
 */
export function getLettersInWord(
  text: string,
  allowNumbers = false,
): Dictionary<boolean> {
  const lettersInWord: Dictionary<boolean> = {};

  for (const character of text) {
    if (!isGuessableFilmacoCharacter(character, allowNumbers)) {
      continue;
    }

    lettersInWord[normalizeFilmacoCharacter(character)] = false;
  }

  return lettersInWord;
}

/**
 * Counts how many unique solution characters have already been discovered.
 *
 * @param solution - Normalized solution map for today's title.
 * @returns Number of unique letters/digits marked as solved.
 */
export function countSolvedLetters(solution: Dictionary<boolean>): number {
  return Object.values(solution).filter(Boolean).length;
}

/**
 * Counts how many unique guessable characters today's title contains.
 *
 * @param solution - Normalized solution map for today's title.
 * @returns Total number of unique letters/digits the player must discover.
 */
export function countTotalLetters(solution: Dictionary<boolean>): number {
  return Object.keys(solution).length;
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
    key: gameIdToLocalTodayKey(gameInfo.id),
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}
