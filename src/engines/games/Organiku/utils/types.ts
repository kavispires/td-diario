import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Organiku, kept in local storage so a page
 * reload doesn't lose the player's progress within the same day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Grid indexes already revealed (matched), keyed by index.
   */
  revealed: Dictionary<boolean>;
  /**
   * Count of revealed tiles per item id, used to detect a fully-found item.
   */
  foundCount: Dictionary<number>;
  /**
   * Number of tile flips made so far.
   */
  flips: number;
}>;

/**
 * Ephemeral, non-persisted interaction state (the tiles currently flipped
 * while the player is comparing a pair).
 */
export type SessionState = {
  /**
   * Index of the first tile flipped in the current pair, or `null`.
   */
  activeTileIndex: number | null;
  /**
   * Index of the second tile flipped in the current pair, or `null`.
   */
  pairActiveTileIndex: number | null;
};

/**
 * Per-item completion tracking derived from the current revealed state.
 */
export type OrganikuTracker = {
  /**
   * Remaining tile count per item id before it's fully found.
   */
  remainingCounts: Dictionary<number>;
  /**
   * Whether each item id has been fully found.
   */
  completedItems: Dictionary<boolean>;
};
