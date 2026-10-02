import type { DefaultGameState } from 'types/puzzles';

/**
 * Single puzzle-piece descriptor stored in the transient grid state.
 */
export type PieceData = {
  /**
   * Piece id, matching its correct slot index in the solved puzzle.
   */
  id: number;
};

/**
 * Current board arrangement, indexed by slot position.
 */
export type GridState = Array<PieceData | null>;

/**
 * Border visibility for one rendered piece, hiding seams between pieces
 * that are currently attached to one another.
 */
export type PieceBorders = {
  /**
   * Whether the top border should remain visible.
   */
  top: boolean;
  /**
   * Whether the right border should remain visible.
   */
  right: boolean;
  /**
   * Whether the bottom border should remain visible.
   */
  bottom: boolean;
  /**
   * Whether the left border should remain visible.
   */
  left: boolean;
};

/**
 * In-flight drag metadata for the currently moved connected group.
 */
export type ActiveDrag = {
  /**
   * Id of the piece that started the drag.
   */
  pieceId: number;
  /**
   * Slot index where the dragged group started.
   */
  originIndex: number;
  /**
   * Connected-group offsets relative to `originIndex`.
   */
  groupOffsets: number[];
  /**
   * Current pointer X coordinate inside the board.
   */
  pointerX: number;
  /**
   * Current pointer Y coordinate inside the board.
   */
  pointerY: number;
  /**
   * Horizontal distance between the pointer and the dragged anchor slot's left edge.
   */
  offsetX: number;
  /**
   * Vertical distance between the pointer and the dragged anchor slot's top edge.
   */
  offsetY: number;
  /**
   * Slot index currently targeted by the drag preview.
   */
  targetIndex: number;
} | null;

/**
 * Persisted per-day Vitral progress.
 */
export type GameState = DefaultGameState<{
  /**
   * Remaining hearts before the timer-based loss condition triggers.
   */
  hearts: number;
  /**
   * Elapsed play time, in seconds.
   */
  timeElapsed: number;
  /**
   * Current piece ids ordered by slot index.
   */
  piecesOrder: number[];
  /**
   * Number of completed swap actions performed so far.
   */
  swapCount: number;
}>;

/**
 * Ephemeral board-only interaction state that should not persist between
 * reloads.
 */
export type SessionState = {
  /**
   * Current board arrangement used for rendering and drag operations.
   */
  grid: GridState;
  /**
   * Metadata for the drag currently in progress, if any.
   */
  activeDrag: ActiveDrag;
};

/**
 * Pixel measurements derived from the current board container size.
 */
export type BoardMeasures = {
  /**
   * Rendered board width, in pixels.
   */
  width: number;
  /**
   * Rendered board height, in pixels.
   */
  height: number;
  /**
   * Width of one board cell, in pixels.
   */
  cellWidth: number;
  /**
   * Height of one board cell, in pixels.
   */
  cellHeight: number;
  /**
   * Number of grid rows in today's puzzle.
   */
  rows: number;
  /**
   * Total number of puzzle slots.
   */
  totalSlots: number;
};
