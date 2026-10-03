import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyMapeamentoEntry } from 'types/games';
import { gameInfo } from '../info';
import type { GameState } from './types';

function stripAccents(value: string): string {
  return value.normalize('NFD').replaceAll(/\p{Diacritic}/gu, '');
}

/**
 * Total number of mistakes the player can make before losing.
 */
export const MAPEAMENTO_HEARTS = 4;

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
      fragments.push('_');
      inGap = true;
    }
  }

  return fragments;
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
