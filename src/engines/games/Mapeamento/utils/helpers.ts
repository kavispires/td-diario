import type { KeyboardKeyState } from '@components/games/Keyboard';
import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyMapeamentoEntry } from 'types/games';
import { gameInfo } from '../info';
import { LOCATION_FRAGMENT_PLACEHOLDER, MAPEAMENTO_HEARTS } from './constants';
import type { GameState } from './types';

function stripAccents(value: string): string {
  return value.normalize('NFD').replaceAll(/\p{Diacritic}/gu, '');
}

/**
 * Builds the default `GameState` for a fresh Mapeamento day.
 *
 * @param data - Today's Mapeamento challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyMapeamentoEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: MAPEAMENTO_HEARTS,
    guesses: [],
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Mapeamento state, restoring it from local storage when
 * it matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data - Today's Mapeamento challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyMapeamentoEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Normalizes text for strict answer comparisons by removing accents,
 * collapsing whitespace, and stripping punctuation.
 *
 * @param value - Raw text to normalize.
 * @returns A comparison-friendly string.
 */
export function normalizeComparableLocationText(value: string): string {
  return stripAccents(value)
    .trim()
    .replaceAll(/\s+/g, ' ')
    .toLowerCase()
    .replaceAll(/[^a-z0-9\s]/g, '');
}

/**
 * Reveals the ordered letter fragments discovered so far by previous wrong
 * guesses, collapsing every still-unknown run into a single underscore.
 *
 * @param location - Correct answer for today's challenge.
 * @param guesses - Wrong guesses submitted so far.
 * @returns A condensed fragment list that preserves accents from `location`.
 */
export function getLocationFragments(
  location: string,
  guesses: string[],
): string[] {
  const guessedLetters = new Set(guesses.join('').toUpperCase().split(''));
  const targetLocation = location.toUpperCase();
  const normalizedTarget = stripAccents(targetLocation).toUpperCase();
  const fragments: string[] = [];
  let inGap = false;

  for (const [index, char] of Array.from(targetLocation).entries()) {
    const comparableChar = normalizedTarget[index];

    if (guessedLetters.has(char) || guessedLetters.has(comparableChar)) {
      fragments.push(char);
      inGap = false;
      continue;
    }

    if (!inGap) {
      fragments.push(LOCATION_FRAGMENT_PLACEHOLDER);
      inGap = true;
    }
  }

  return fragments;
}

/**
 * Counts every guessable (alphanumeric) character in the answer, including
 * repeats, ignoring spaces and punctuation. Used as the denominator for
 * progress, so progress reflects the absolute number of letters in the
 * location name rather than the number of guesses made.
 *
 * @param location - Correct answer for today's challenge.
 * @returns The total count of guessable letters in `location`.
 */
export function countGuessableLetters(location: string): number {
  return normalizeComparableLocationText(location).replaceAll(' ', '').length;
}

/**
 * Counts how many letter positions in the answer have already been
 * revealed, based on the already-collapsed fragment list (each revealed
 * position is pushed individually, while unknown runs collapse to a single
 * placeholder).
 *
 * @param fragments - Revealed letter fragments built from guesses so far.
 * @returns The count of already-revealed letter positions.
 */
export function countRevealedLetters(fragments: string[]): number {
  return fragments.filter(
    (fragment) => fragment !== LOCATION_FRAGMENT_PLACEHOLDER,
  ).length;
}

/**
 * Calculates progress as the fraction of the answer's guessable letters
 * already revealed, from `0` to `1`.
 *
 * @param location - Correct answer for today's challenge.
 * @param fragments - Revealed letter fragments built from guesses so far.
 * @returns The fraction of guessable letters already revealed.
 */
export function calculateLocationProgress(
  location: string,
  fragments: string[],
): number {
  const totalGuessableLetters = countGuessableLetters(location);

  if (totalGuessableLetters === 0) {
    return 0;
  }

  return Math.min(countRevealedLetters(fragments) / totalGuessableLetters, 1);
}

/**
 * Counts how many distinct answer letters a freshly submitted guess reveals
 * for the first time, comparing the letters already known from previous
 * guesses against the letters newly introduced by `guess`.
 *
 * @param location - Correct answer for today's challenge.
 * @param previousGuesses - Guesses submitted before this round.
 * @param guess - The guess just submitted.
 * @returns The count of newly revealed distinct answer letters.
 */
export function countNewlyRevealedLetters(
  location: string,
  previousGuesses: string[],
  guess: string,
): number {
  const locationLetters = new Set(
    normalizeComparableLocationText(location)
      .toUpperCase()
      .split('')
      .filter((char) => /[A-Z0-9]/.test(char)),
  );
  const previouslyKnownLetters = new Set(
    normalizeComparableLocationText(previousGuesses.join(''))
      .toUpperCase()
      .split(''),
  );
  const guessLetters = new Set(
    normalizeComparableLocationText(guess).toUpperCase().split(''),
  );

  let newlyRevealedCount = 0;
  for (const letter of guessLetters) {
    if (locationLetters.has(letter) && !previouslyKnownLetters.has(letter)) {
      newlyRevealedCount += 1;
    }
  }

  return newlyRevealedCount;
}

/**
 * Determines whether the accumulated wrong guesses have already surfaced
 * every distinct alphanumeric character present in the answer.
 *
 * @param location - Correct answer for today's challenge.
 * @param guesses - Wrong guesses submitted so far.
 * @returns Whether all unique answer letters are already known.
 */
export function hasFoundAllLocationLetters(
  location: string,
  guesses: string[],
): boolean {
  const guessedLetters = new Set(
    normalizeComparableLocationText(guesses.join('')).toUpperCase().split(''),
  );
  const uniqueLetters = new Set(
    normalizeComparableLocationText(location)
      .toUpperCase()
      .split('')
      .filter((char) => /[A-Z0-9]/.test(char)),
  );

  return Array.from(uniqueLetters).every((letter) =>
    guessedLetters.has(letter),
  );
}

/**
 * Returns the clues currently visible to the player for a given heart count.
 *
 * @param clues - Ordered clue list for today's challenge.
 * @param hearts - Remaining hearts.
 * @returns The prefix of clues unlocked so far.
 */
export function getAvailableClues(clues: string[], hearts: number): string[] {
  return clues.slice(0, MAPEAMENTO_HEARTS - hearts + 1);
}

/**
 * Builds the on-screen keyboard's per-key visual feedback from every
 * letter/digit typed across previous guesses: `correct` when it's part of
 * an already-revealed fragment, `incorrect` otherwise. Keys are never
 * marked `disabled`, since the same character can be retyped across
 * multiple location guesses.
 *
 * @param guesses - Wrong guesses submitted so far.
 * @param locationFragments - Revealed letter fragments built from those
 *   guesses.
 * @returns The keyboard state keyed by lowercase character.
 */
export function buildKeyboardKeysState(
  guesses: string[],
  locationFragments: string[],
): Dictionary<KeyboardKeyState> {
  const keysState: Dictionary<KeyboardKeyState> = {};
  const revealedCharacters = new Set(
    normalizeComparableLocationText(locationFragments.join('')).split(''),
  );

  for (const guess of guesses) {
    for (const character of normalizeComparableLocationText(guess)) {
      if (keysState[character] || !/[a-z0-9]/.test(character)) {
        continue;
      }

      keysState[character] = {
        state: revealedCharacters.has(character) ? 'correct' : 'incorrect',
      };
    }
  }

  return keysState;
}

/**
 * Builds the plain-text shareable result for today's Mapeamento run.
 *
 * @param options - Today's challenge number and remaining hearts.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
}: {
  challengeNumber: number;
  hearts: number;
}): string {
  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: MAPEAMENTO_HEARTS,
    remainingHearts: hearts,
  });
}
