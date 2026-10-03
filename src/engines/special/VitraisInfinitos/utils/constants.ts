import type { DailyVitraisInfinitosEntry } from 'types/games';

/**
 * Fixed number of columns used by the Vitrais Infinitos board.
 */
export const GRID_COLUMNS = 3;

/**
 * Score awarded for each piece currently placed in its solved slot.
 */
export const SCORE_PER_CORRECT_PIECE = 10;

/**
 * Fallback daily entry used when the shared placeholder payload cannot be
 * narrowed to a Vitrais Infinitos puzzle.
 */
export const FALLBACK_ENTRY: DailyVitraisInfinitosEntry = {
  id: 'invalid-vitrais-infinitos-entry',
  number: 0,
  type: 'vitrais-infinitos',
  title: '',
  cardId: '',
  pieces: [0, 1, 2, 3, 4, 5],
};

/**
 * Outer horizontal margin reserved when measuring the board container width.
 */
export const BOARD_CONTAINER_MARGIN = 72;

/**
 * Amount of responsive columns used when measuring the puzzle board width.
 */
export const BOARD_CONTAINER_COLUMNS = 1;

/**
 * Horizontal gap reserved between measured board columns.
 */
export const BOARD_CONTAINER_GAP = 0;

/**
 * Maximum width, in pixels, allowed for the measured puzzle board.
 */
export const BOARD_MAX_WIDTH = 512;

/**
 * Minimum width, in pixels, allowed for the measured puzzle board.
 */
export const BOARD_MIN_WIDTH = 256;

/**
 * Motion settings used to animate the puzzle completion progress bar.
 */
export const PROGRESS_BAR_TRANSITION = {
  duration: 0.2,
  ease: 'easeOut',
} as const;

/**
 * Height multiplier applied to the board width to preserve the stained-glass
 * layout proportions.
 */
export const BOARD_ASPECT_RATIO = 1.5;

/**
 * Minimum fallback width used before the board container is measured.
 */
export const BOARD_FALLBACK_WIDTH = 300;

/**
 * Pointer travel, in pixels, required before a press is treated as a drag.
 */
export const DRAG_DISTANCE_THRESHOLD = 6;

/**
 * Spring motion settings used when puzzle pieces slide into their next slots.
 */
export const PIECE_MOVE_TRANSITION = {
  type: 'spring',
  stiffness: 350,
  damping: 28,
} as const;

/**
 * Number of summary columns shown in the completed-results stats grid.
 */
export const RESULTS_STATS_COLUMNS = 3;
