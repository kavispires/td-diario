import { USE_FIRESTORE_EMULATOR } from '@services/firebase';
import { differenceInMilliseconds, format, startOfTomorrow } from 'date-fns';
/**
 * Flag indicating if the environment is for development
 */
export const isDevEnv: boolean = import.meta.env.MODE === 'development';

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
