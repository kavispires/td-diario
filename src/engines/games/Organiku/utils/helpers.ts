import { loadLocalToday } from '@hooks/useDailyLocalToday';
import type { DailyOrganikuEntry } from '../../../../types/games';
import type { GameState } from './types';

/**
 * Short uppercase key used to namespace Organiku's local storage entry.
 */
export const ORGANIKU_STORAGE_KEY = 'ORGANIKU';

/**
 * Total hearts (lives) a player starts each day's Organiku with.
 */
export const ORGANIKU_HEARTS = 5;

/**
 * Builds the default `GameState` for a fresh day, treating any
 * `defaultRevealedIndexes` as already found.
 *
 * @param data - Today's Organiku challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyOrganikuEntry): GameState {
  const revealed: Dictionary<boolean> = {};
  const foundCount: Dictionary<number> = {};

  for (const index of data.defaultRevealedIndexes) {
    revealed[index] = true;
    const itemId = data.grid[index];
    foundCount[itemId] = (foundCount[itemId] ?? 0) + 1;
  }

  return {
    id: data.id,
    status: 'in-progress',
    hearts: ORGANIKU_HEARTS,
    revealed,
    foundCount,
    flips: 0,
  };
}

/**
 * Retrieves today's Organiku state, restoring it from local storage when
 * it matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data - Today's Organiku challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyOrganikuEntry): GameState {
  return loadLocalToday<GameState>({
    key: ORGANIKU_STORAGE_KEY,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Lists every grid index sharing the same row or column as `index`, used to
 * temporarily block those tiles while a pair is mid-comparison (since no
 * item repeats within a row or column).
 *
 * @param index - The grid index to compute row/column neighbors for.
 * @param gridSize - The grid's side length (grid has `gridSize x gridSize` tiles).
 * @returns Indexes sharing `index`'s row or column, excluding `index` itself.
 */
export function getRowAndColumnIndexes(
  index: number,
  gridSize: number,
): number[] {
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const indexes: number[] = [];

  for (let c = 0; c < gridSize; c++) {
    const i = row * gridSize + c;
    if (i !== index) indexes.push(i);
  }

  for (let r = 0; r < gridSize; r++) {
    const i = r * gridSize + col;
    if (i !== index) indexes.push(i);
  }

  return indexes;
}
