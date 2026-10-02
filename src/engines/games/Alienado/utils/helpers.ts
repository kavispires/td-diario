import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyAlienadoEntry } from 'types/games';
import { gameInfo } from '../info';
import type { GameState } from './types';

/**
 * Builds the default `GameState` for a fresh day of Alienado.
 *
 * Hearts start equal to the number of requests the player must satisfy.
 *
 * @param data Today's Alienado challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyAlienadoEntry): GameState {
  return {
    id: data.id,
    number: data.number,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: data.requests.length,
    guesses: [],
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Alienado state, restoring it from local storage when it
 * matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data Today's Alienado challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyAlienadoEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Splits Alienado's persisted solution/guess format into an ordered list of
 * item ids.
 *
 * @param value Persisted `item-item-item-item` value.
 * @returns The ordered item ids.
 */
export function splitGuess(value: string): string[] {
  return value.split('-');
}

/**
 * Counts how many positions in a guess exactly match today's solution.
 *
 * @param guessItems Item ids chosen by the player in slot order.
 * @param solutionItems Correct item ids in slot order.
 * @returns The number of exact positional matches.
 */
export function countMatchedPositions(
  guessItems: string[],
  solutionItems: string[],
): number {
  return guessItems.reduce(
    (total, itemId, index) => total + (itemId === solutionItems[index] ? 1 : 0),
    0,
  );
}
