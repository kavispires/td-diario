import type { DefaultGameState } from 'types/puzzles';

/**
 * One item rendered inside an Aqui O disc.
 */
export type AquiOItem = {
  /**
   * Sprite id of the item shown in the slot.
   */
  itemId: string;
  /**
   * Position index in the disc's 3x3 playable area.
   */
  position: number;
  /**
   * Relative scale percentage applied to the item.
   */
  size: number;
  /**
   * Random rotation angle applied to the item.
   */
  rotation: number;
  /**
   * Stacking order used when larger items overlap neighbors.
   */
  zIndex: number;
};

/**
 * One full Aqui O disc, including all rendered items and the shared match
 * with the previous disc when applicable.
 */
export type AquiODisc = {
  /**
   * Stable key representing this disc's item combination.
   */
  id: string;
  /**
   * Items rendered on the disc.
   */
  items: AquiOItem[];
  /**
   * Item id shared with the previous disc, when this disc is not the first.
   */
  match?: string;
};

/**
 * Ways an Aqui O round can end or remain parked between attempts.
 */
export type RoundStopType = 'win' | 'lose' | 'timeout' | 'idle';

/**
 * Persisted per-day progress for Aqui O, kept in local storage so a page
 * reload does not lose the player's best run, score, or remaining hearts.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts across all attempts of the day.
   */
  hearts: number;
  /**
   * Number of matches required to solve today's challenge.
   */
  goal: number;
  /**
   * Number of attempts started today.
   */
  attempts: number;
  /**
   * Best disc count reached across all attempts today.
   */
  maxProgress: number;
  /**
   * Whether challenge mode is enabled for the next attempt.
   */
  hardMode: boolean;
}>;

/**
 * Ephemeral, non-persisted state for the currently visible Aqui O round.
 */
export type SessionState = {
  /**
   * Index of the current disc pair (`discIndex` and `discIndex + 1`).
   */
  discIndex: number;
  /**
   * Ordered disc sequence for the active round.
   */
  discs: AquiODisc[];
  /**
   * Why the current or most recent round stopped.
   */
  stopType: RoundStopType;
};
