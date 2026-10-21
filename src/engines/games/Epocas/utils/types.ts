import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Épocas, kept in local storage so a page
 * reload doesn't lose the player's timeline for the current day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Current timeline order, as a permutation of indices into
   * `data.events`. Starts as the shuffled, incorrect order sent by the
   * backend and is only ever changed by the player swapping two events.
   */
  order: number[];
  /**
   * How many events were in their correct position on each past verify
   * attempt, in the order they were made.
   */
  attempts: number[];
}>;

/**
 * Ephemeral, non-persisted interaction state for the current play session.
 */
export type SessionState = {
  /**
   * Index (within `order`) of the event currently selected for the
   * tap-to-select-then-swap fallback, or `null` when nothing is selected.
   */
  selectedIndex: number | null;
  /**
   * Timestamp of the latest failed verify attempt, used to replay a shake
   * animation.
   */
  latestAttempt: number;
};

/**
 * Everything the Épocas screen needs from the engine hook.
 */
export type EpocasEngineState = {
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Current timeline order, as a permutation of indices into
   * `data.events`.
   */
  order: number[];
  /**
   * How many events were correctly placed on each past verify attempt.
   */
  attempts: number[];
  /**
   * Index (within `order`) currently selected for a tap-to-swap, or `null`.
   */
  selectedIndex: number | null;
  /**
   * Timestamp of the latest failed verify attempt.
   */
  latestAttempt: number;
  /**
   * Current score accumulated through verify attempts.
   */
  score: number;
  /**
   * Completion share from `0` to `1`.
   */
  progress: number;
  /**
   * Whether the fullscreen results splash is visible.
   */
  showResults: boolean;
  /**
   * Updates the results-splash visibility.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Whether today's puzzle has been solved.
   */
  isWin: boolean;
  /**
   * Whether today's puzzle has been lost.
   */
  isLose: boolean;
  /**
   * Whether today's puzzle is in a final state.
   */
  isComplete: boolean;
  /**
   * Swaps the events currently at the two given positions.
   */
  onSwap: (fromIndex: number, toIndex: number) => void;
  /**
   * Moves the event at `fromIndex` to the given insertion gap, shifting
   * the events in between instead of swapping two positions.
   */
  onMove: (fromIndex: number, toGapIndex: number) => void;
  /**
   * Tap-to-swap fallback: the first tap selects a position, a second tap
   * on a different position swaps them, and tapping the same position
   * twice clears the selection.
   */
  onSelectForSwap: (index: number) => void;
  /**
   * Submits the current order for verification.
   */
  onVerify: () => void;
};
