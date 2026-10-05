import type { DefaultGameState } from 'types/puzzles';
import type { ESTOQUISTA_PHASE } from './constants';

/**
 * Identifier of one warehouse good or order item.
 */
export type GoodId = string;

/**
 * One placed order assignment, pairing an order with the shelf it was
 * dropped onto.
 */
export type Fulfillment = {
  /**
   * Id of the order item being assigned.
   */
  order: GoodId;
  /**
   * Shelf index receiving the order.
   */
  shelfIndex: number;
};

/**
 * Persisted per-day progress for Estoquista, kept in local storage so a
 * reload does not discard the current warehouse layout.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Current phase of the puzzle.
   */
  phase: (typeof ESTOQUISTA_PHASE)[keyof typeof ESTOQUISTA_PHASE];
  /**
   * Goods already placed on the warehouse shelves.
   */
  warehouse: Array<GoodId | null>;
  /**
   * Orders currently assigned to shelves or to the out-of-stock slot.
   */
  fulfillments: Fulfillment[];
  /**
   * Most recently placed good, kept visible during stocking as feedback.
   */
  lastPlacedGoodId: GoodId | null;
  /**
   * Normalized signatures of already-submitted assignment combinations.
   */
  guesses: string[];
  /**
   * Per-attempt correctness results, aligned to `data.orders`.
   */
  evaluations: boolean[][];
  /**
   * Number of times the player restarted the stocking phase today.
   */
  extraAttempts: number;
}>;

/**
 * Ephemeral, non-persisted interaction state for the fulfillment phase.
 */
export type SessionState = {
  /**
   * Order currently selected to be placed, or `null`.
   */
  activeOrder: GoodId | null;
};

/**
 * Public state and actions returned by {@link useEstoquistaEngine}.
 */
export type EstoquistaEngineState = {
  /**
   * Remaining hearts (lives).
   */
  hearts: number;
  /**
   * Total hearts granted for today's puzzle before any mistakes or resets.
   */
  totalHearts: number;
  /**
   * Current phase of the puzzle.
   */
  phase: GameState['phase'];
  /**
   * Warehouse shelf contents.
   */
  warehouse: GameState['warehouse'];
  /**
   * Orders already assigned to shelves or to the out-of-stock slot.
   */
  fulfillments: Fulfillment[];
  /**
   * Most recently placed good, kept visible during stocking.
   */
  lastPlacedGoodId: GoodId | null;
  /**
   * Order currently selected for placement, or `null`.
   */
  activeOrder: GoodId | null;
  /**
   * Ordered list of correctness results for each submitted attempt.
   */
  evaluations: boolean[][];
  /**
   * Id of the next good that still needs to be stocked, or `null`.
   */
  currentGood: GoodId | null;
  /**
   * Whether the fullscreen results splash is visible.
   */
  showResults: boolean;
  /**
   * Controls the visibility of the fullscreen results splash.
   */
  setShowResults: (value: boolean) => void;
  /**
   * Current progress fraction, from `0` to `1`.
   */
  progress: number;
  /**
   * Score accumulated so far.
   */
  score: number;
  /**
   * Whether the game has ended in a win.
   */
  isWin: boolean;
  /**
   * Whether the game has ended in a loss.
   */
  isLose: boolean;
  /**
   * Whether the game has reached any final state.
   */
  isComplete: boolean;
  /**
   * Places the current stocking good on the chosen empty shelf.
   */
  onPlaceGood: (shelfIndex: number) => void;
  /**
   * Selects or deselects an order during fulfillment.
   */
  onSelectOrder: (order: GoodId) => void;
  /**
   * Places an order on a shelf, or moves it there if it was already placed
   * on a different shelf. Uses the currently selected order when `order` is
   * omitted (tap-to-place flow), or the explicitly given one (drag-and-drop
   * flow, including dragging an already-placed order to a new shelf).
   */
  onFulfill: (shelfIndex: number, order?: GoodId) => void;
  /**
   * Removes an assigned order and makes it the active selection again.
   */
  onTakeBack: (order: GoodId) => void;
  /**
   * Submits the current fulfillment attempt for validation.
   */
  onSubmit: () => void;
  /**
   * Restarts the stocking phase at the cost of one heart, when allowed.
   */
  reset: () => void;
};
