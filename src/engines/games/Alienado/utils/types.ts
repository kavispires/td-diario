import type { DefaultGameState } from 'types/puzzles';

/**
 * Persisted per-day progress for Alienado, kept in local storage so a page
 * reload doesn't lose the player's attempts within the same day.
 */
export type GameState = DefaultGameState<{
  /**
   * Sequential challenge number shown to the player.
   */
  number: number;
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Previous submitted guesses, each encoded as `item-item-item-item`.
   */
  guesses: string[];
}>;

/**
 * Ephemeral, non-persisted interaction state for the current in-progress
 * guess being assembled on screen.
 */
export type SessionState = {
  /**
   * Item ids currently placed into the four request slots.
   */
  selection: Array<string | null>;
  /**
   * Index of the slot currently focused for the next placement, or `null`.
   */
  slotIndex: number | null;
  /**
   * Timestamp of the latest wrong/duplicate attempt, used to retrigger the
   * board shake animation.
   */
  latestAttempt: number | null;
};

/**
 * Public state and actions exposed by {@link useAlienadoEngine}.
 */
export type AlienadoEngineState = {
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Previous submitted guesses, encoded as `item-item-item-item`.
   */
  guesses: string[];
  /**
   * Current slot contents for the in-progress guess.
   */
  selection: Array<string | null>;
  /**
   * Index of the currently focused slot, or `null`.
   */
  slotIndex: number | null;
  /**
   * Timestamp of the latest wrong/duplicate attempt, used for animations.
   */
  latestAttempt: number | null;
  /**
   * Whether all slots are currently filled and the guess can be submitted.
   */
  isReady: boolean;
  /**
   * Whether the game ended in either a win or a loss.
   */
  isComplete: boolean;
  /**
   * Whether the game ended in a win.
   */
  isWin: boolean;
  /**
   * Whether the game ended in a loss.
   */
  isLose: boolean;
  /**
   * Whether the fullscreen results splash is visible.
   */
  showResults: boolean;
  /**
   * Current score for the day.
   */
  score: number;
  /**
   * Shows or hides the results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Focuses one of the request slots for the next placement.
   */
  onSelectSlot: (index: number) => void;
  /**
   * Places an available item into the focused or first empty slot.
   */
  onSelectItem: (itemId: string) => void;
  /**
   * Removes the currently placed item from a slot.
   */
  onClearSlot: (index: number) => void;
  /**
   * Places a dragged item into a slot: moves a pool item into an empty or
   * occupied slot (freeing its previous slot, if any), or swaps two slots
   * when the drag originates from another slot.
   */
  onDropItem: (
    itemId: string,
    source: 'pool' | 'slot',
    sourceIndex: number | undefined,
    targetIndex: number,
  ) => void;
  /**
   * Submits the current four-item guess.
   */
  submitGuess: () => void;
};
