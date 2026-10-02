import {
  gameIdToLocalTodayKey,
  loadLocalToday,
} from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyQuartetosEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { gameInfo } from '../info';
import type { GameState } from './types';

/**
 * Builds the default `GameState` for a fresh Quartetos day.
 *
 * Hearts start equal to the number of hidden quartets, matching the original
 * "four mistakes max" rule while still deriving from today's payload.
 *
 * @param data - Today's Quartetos challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyQuartetosEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: data.sets.length,
    guesses: [],
    matches: [],
    grid: [...data.grid],
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Quartetos state, restoring it from local storage when it
 * matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data - Today's Quartetos challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyQuartetosEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameIdToLocalTodayKey(gameInfo.id),
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Normalizes a quartet's item ids into a stable comparison key so the same
 * combination matches regardless of the order in which the player tapped it.
 *
 * @param items - The four selected item ids.
 * @returns The normalized quartet key.
 */
export function buildSetKey(items: string[]): string {
  return [...items]
    .sort((left, right) => Number(left) - Number(right))
    .join('-');
}

/**
 * Returns a new array with the provided items shuffled in random order.
 *
 * @param items - Items to shuffle.
 * @returns A shuffled copy of `items`.
 */
export function shuffleItems<TItem>(items: TItem[]): TItem[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [
      nextItems[swapIndex],
      nextItems[index],
    ];
  }

  return nextItems;
}

/**
 * Narrows the shared `GameScreen` payload to a real Quartetos daily payload.
 *
 * @param data - Dynamic game payload resolved by `GameScreen`.
 * @returns Whether `data` has the fields required by Quartetos.
 */
export function isDailyQuartetosEntry(
  data: PlaceholderGameData,
): data is DailyQuartetosEntry {
  return (
    data.type === 'quartetos' &&
    Array.isArray(data.grid) &&
    Array.isArray(data.sets)
  );
}
