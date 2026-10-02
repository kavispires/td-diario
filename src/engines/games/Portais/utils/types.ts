import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Portais, kept in local storage so a page
 * reload doesn't lose the player's run within the same day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Submitted guesses for each corridor, in submission order.
   */
  guesses: string[][];
  /**
   * Zero-based index of the corridor currently in play.
   */
  currentCorridorIndex: number;
  /**
   * Current selected position for each word column in the active corridor.
   */
  currentCorridorIndexes: number[];
  /**
   * Move count per corridor, incremented every time a column rotates.
   */
  moves: number[];
}>;
