import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Vitrais Infinitos, kept in local storage so
 * a reload preserves the current arrangement of today's puzzle.
 */
export type GameState = DefaultGameState<{
  /**
   * Current piece id occupying each board slot, in render order.
   */
  pieceOrder: number[];
  /**
   * Number of successful board rearrangements made so far.
   */
  moveCount: number;
  /**
   * Total amount of pieces in today's puzzle, used to validate restores.
   */
  pieceCount: number;
}>;
