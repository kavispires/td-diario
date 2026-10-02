import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyArteRuimEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { gameInfo } from '../info';
import type { GameState } from './types';

/**
 * Number of mistakes the player can make before losing today's Arte Ruim.
 */
export const ARTE_RUIM_HEARTS = 3;

/**
 * Shared keyboard row layout shown under the puzzle.
 */
export const KEYBOARD_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'] as const;

/**
 * Normalizes a character for answer matching, removing accents and forcing
 * lowercase.
 *
 * @param value - Raw character from the answer or from player input.
 * @returns The normalized letter used for comparisons.
 */
export function normalizeLetter(value: string): string {
  return value
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Determines whether a normalized character should be guessable from the
 * keyboard.
 *
 * @param value - Normalized character to inspect.
 * @returns Whether the character is an ASCII letter.
 */
export function isPlayableLetter(value: string): boolean {
  return /^[a-z]$/.test(value);
}

/**
 * Extracts the unique, guessable letters present in the answer text.
 *
 * @param text - Secret expression for today's puzzle.
 * @returns A dictionary keyed by unique letters, initially all hidden.
 */
export function getLettersInText(text: string): Dictionary<boolean> {
  const lettersInText: Dictionary<boolean> = {};

  for (const rawCharacter of text) {
    const letter = normalizeLetter(rawCharacter);
    if (isPlayableLetter(letter)) {
      lettersInText[letter] = false;
    }
  }

  return lettersInText;
}

/**
 * Counts how many times a guessed letter appears in the full answer.
 *
 * @param text - Secret expression for today's puzzle.
 * @param letter - Normalized letter to count.
 * @returns The number of visible characters that guess would reveal.
 */
export function countLetterOccurrences(text: string, letter: string): number {
  let count = 0;

  for (const rawCharacter of text) {
    if (normalizeLetter(rawCharacter) === letter) {
      count += 1;
    }
  }

  return count;
}

/**
 * Counts how many unique letters in the solution have already been found.
 *
 * @param solution - Dictionary keyed by solution letters.
 * @returns The number of entries currently marked as found.
 */
export function countRevealedLetters(solution: Dictionary<boolean>): number {
  return Object.values(solution).filter(Boolean).length;
}

/**
 * Calculates the persisted progress value for Arte Ruim, from `0` to `1`.
 *
 * @param solution - Dictionary keyed by solution letters.
 * @returns Fraction of unique letters already discovered.
 */
export function getProgress(solution: Dictionary<boolean>): number {
  const totalLetters = Object.keys(solution).length;
  if (totalLetters === 0) {
    return 1;
  }

  return countRevealedLetters(solution) / totalLetters;
}

/**
 * Builds the default `GameState` for a fresh Arte Ruim day.
 *
 * @param data - Today's Arte Ruim challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyArteRuimEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: ARTE_RUIM_HEARTS,
    solution: getLettersInText(data.text),
    guesses: {},
    progress: 0,
    score: 0,
  };
}

/**
 * Validates that a restored local Arte Ruim state still matches today's
 * answer and has coherent persisted fields.
 *
 * @param state - Restored local state candidate.
 * @param data - Today's Arte Ruim challenge payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyArteRuimEntry): boolean {
  const expectedLetters = Object.keys(getLettersInText(data.text)).sort();
  const currentLetters = Object.keys(state.solution).sort();

  return (
    state.hearts >= 0 &&
    state.hearts <= ARTE_RUIM_HEARTS &&
    state.progress >= 0 &&
    state.progress <= 1 &&
    state.score >= 0 &&
    expectedLetters.length === currentLetters.length &&
    expectedLetters.every((letter, index) => letter === currentLetters[index])
  );
}

/**
 * Retrieves today's Arte Ruim state, restoring it from local storage when
 * it still matches today's answer, or building a fresh state otherwise.
 *
 * @param data - Today's Arte Ruim challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyArteRuimEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Runtime guard for the Arte Ruim payload expected by the real game
 * component, useful while the shared screen registry is still typed against
 * placeholder payloads.
 *
 * @param value - Unknown challenge payload received from the registry.
 * @returns Whether the payload satisfies {@link DailyArteRuimEntry}.
 */
export function isDailyArteRuimEntry(
  value: PlaceholderGameData | DailyArteRuimEntry,
): value is DailyArteRuimEntry {
  return (
    value.type === 'arte-ruim' &&
    typeof value.id === 'string' &&
    typeof value.number === 'number' &&
    typeof value.text === 'string' &&
    typeof value.cardId === 'string' &&
    (value.language === 'pt' || value.language === 'en') &&
    Array.isArray(value.drawings) &&
    value.drawings.every((drawing) => typeof drawing === 'string') &&
    Array.isArray(value.dataIds) &&
    value.dataIds.every((dataId) => typeof dataId === 'string')
  );
}
