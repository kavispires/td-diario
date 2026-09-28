/**
 * This file holds the "real", per-game daily-payload types that replace
 * `PlaceholderGameData` (see `puzzles.ts`) as each game gets ported with
 * its final data model. Add one exported type per ported game here, and
 * reference it from `GamesEntries`/`ContributionsEntries` in `puzzles.ts`.
 */

/**
 * Today's Organiku challenge payload.
 */
export type DailyOrganikuEntry = {
  /**
   * Today's daily challenge id (a date string).
   */
  id: string;
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  type: 'organiku';
  /**
   * Id of the item set used to build today's grid.
   */
  setId: string;
  /**
   * Title describing the theme of today's grid.
   */
  title: string;
  /**
   * Ids of the distinct items placed in the grid.
   */
  itemsIds: string[];
  /**
   * Flattened `gridSize x gridSize` grid of item ids.
   */
  grid: string[];
  /**
   * Grid indexes revealed from the start (already solved for the player).
   */
  defaultRevealedIndexes: number[];
};
