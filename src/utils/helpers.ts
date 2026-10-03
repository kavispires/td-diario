import { USE_FIRESTORE_EMULATOR } from '@dev-config';
import {
  differenceInCalendarDays,
  differenceInMilliseconds,
  format,
  startOfTomorrow,
} from 'date-fns';
import { GAME_LIFECYCLE_STATUS } from './constants';
/**
 * Flag indicating if the environment is for development
 */
export const isDevEnv: boolean = import.meta.env.MODE === 'development';

/**
 * Returns a copy of an `rgb(...)`/`rgba(...)` color string with its alpha
 * channel replaced, regardless of the alpha syntax the color originally
 * used (`rgba(r, g, b, a)` or `rgb(r g b / a%)`). Non-rgb color strings
 * (e.g. hex or named colors) are returned unchanged.
 *
 * @param color - The source `rgb(...)`/`rgba(...)` color string.
 * @param alpha - The new alpha value, from `0` (transparent) to `1` (opaque).
 * @returns The color string with its alpha channel updated.
 */
export function withAlpha(color: string, alpha: number): string {
  const match = color.match(
    /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+[\d.]+%?)?\s*\)$/,
  );
  if (!match) {
    return color;
  }
  const [, r, g, b] = match;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns the current date in the format 'YYYY-MM-DD'.
 *
 * @returns The current date in 'YYYY-MM-DD' format.
 */
export function getToday(): string {
  if (isDevEnv && USE_FIRESTORE_EMULATOR) return '2023-10-31';
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Returns the number of milliseconds until the next local midnight.
 */
export function getMillisecondsUntilTomorrow(): number {
  const now = new Date();
  return differenceInMilliseconds(startOfTomorrow(), now);
}

/**
 * Checks whether a `'YYYY-MM-DD'` release date falls within the last
 * `maxDays` days (inclusive), used to flag recently-released games as new
 * regardless of their `GameInfo.release` stage.
 *
 * @param releaseDate - The game's `GameInfo.releaseDate`.
 * @param maxDays - How many days a release stays "recent" for. Defaults to
 *   `21`.
 * @returns `true` when `releaseDate` is today or within the past `maxDays`
 *   days.
 */
export function isRecentRelease(releaseDate: string, maxDays = 21): boolean {
  const daysSinceRelease = differenceInCalendarDays(
    new Date(),
    new Date(releaseDate),
  );
  return daysSinceRelease >= 0 && daysSinceRelease <= maxDays;
}

const methods = {
  // biome-ignore lint/suspicious/noConsole: on purpose
  count: console.count.bind(console),
  // biome-ignore lint/suspicious/noConsole: on purpose
  log: console.log.bind(console),
  // biome-ignore lint/suspicious/noConsole: on purpose
  table: console.table.bind(console),
  // biome-ignore lint/suspicious/noConsole: on purpose
  warn: console.warn.bind(console),
};

/**
 * Prints a message to the console using a specified console method if in development environment.
 * @param message - The message to be printed to the console.
 * @param [method='log'] - The console method to use for printing (one of: 'count', 'log', 'table', 'warn').
 */
export const print = (message: any, method: keyof typeof methods = 'log') => {
  if (isDevEnv) {
    methods[method](message);
  }
};

/**
 * Determines the win, lose, and complete statuses of a game based on its current status.
 * @param status - The current status of the game.
 * @returns An object containing boolean flags for the game's win, lose, and complete statuses.
 */
export const getGameStatuses = (status: string) => {
  const isWin = status === GAME_LIFECYCLE_STATUS.WIN;
  const isLose = status === GAME_LIFECYCLE_STATUS.LOSE;
  const isComplete = isWin || isLose;

  return { isWin, isLose, isComplete };
};

/**
 * Picks the singular or plural form of a word based on a quantity.
 *
 * @param quantity - The quantity determining which form to use.
 * @param singular - The singular form of the word.
 * @param plural - Optional explicit plural form; defaults to `singular` with an `s` appended.
 * @returns The singular form when `quantity` is `1`, otherwise the plural form.
 */
export const pluralize = (
  quantity: number,
  singular: string,
  plural?: string,
): string => {
  return quantity === 1 ? singular : (plural ?? `${singular}s`);
};
