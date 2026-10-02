import type { DailyQuartetosSet } from 'types/games';
import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Quartetos, kept in local storage so a page
 * reload doesn't lose the player's board for the current day.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Normalized keys for each combination the player has already submitted.
   */
  guesses: string[];
  /**
   * Quartets already revealed on the board, in display order.
   */
  matches: DailyQuartetosSet[];
  /**
   * Remaining unsolved item ids still shown in the 4x4 grid.
   */
  grid: string[];
}>;

/**
 * Ephemeral, non-persisted interaction state for the current play session.
 */
export type SessionState = {
  /**
   * Item ids currently selected by the player.
   */
  selection: string[];
  /**
   * Timestamp of the latest incorrect attempt, used to replay the shake
   * animation.
   */
  latestAttempt: number;
  /**
   * Inline feedback message shown under the controls, or `null`.
   */
  feedback: string | null;
};

/**
 * Everything the Quartetos screen needs from the engine hook.
 */
export type QuartetosEngineState = {
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Normalized keys for each submitted guess.
   */
  guesses: string[];
  /**
   * Quartets already revealed in the play area.
   */
  matches: DailyQuartetosSet[];
  /**
   * Item ids still displayed in the unsolved grid.
   */
  grid: string[];
  /**
   * Item ids currently selected by the player.
   */
  selection: string[];
  /**
   * Timestamp of the latest incorrect attempt.
   */
  latestAttempt: number;
  /**
   * Current score accumulated through correct submissions.
   */
  score: number;
  /**
   * Completion share from `0` to `1`.
   */
  progress: number;
  /**
   * Inline feedback shown to the player, or `null`.
   */
  feedback: string | null;
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
   * Toggles an item in the current selection.
   */
  onSelectItem: (itemId: string) => void;
  /**
   * Clears the current selection.
   */
  onDeselectAll: () => void;
  /**
   * Randomizes the order of the remaining unsolved items.
   */
  onShuffle: () => void;
  /**
   * Submits the current selection as a guess.
   */
  onSubmit: () => void;
  /**
   * Clears the current inline feedback message.
   */
  clearFeedback: () => void;
};
