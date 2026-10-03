/**
 * Fixed number of columns in every Vitral puzzle board.
 */
export const COLS = 3;

/**
 * Base number of hearts granted at the start of each Vitral puzzle.
 */
export const VITRAL_TOTAL_HEARTS = 5;

/**
 * Base amount of seconds between heart losses before piece-count scaling.
 */
export const HEART_LOSS_INTERVAL_SECONDS = 20;

/**
 * Border style applied to puzzle pieces so disconnected seams stay visible.
 */
export const BORDER_STYLE = '0.5px solid rgba(0, 0, 0, 0.55)';

/**
 * Border style applied to the drag overlay preview for connected pieces.
 */
export const OVERLAY_BORDER_STYLE = '0.5px solid rgba(255, 255, 255, 0.85)';
