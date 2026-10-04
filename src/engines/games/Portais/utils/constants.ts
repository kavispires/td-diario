/**
 * Number of hearts Portais grants at the start of each run.
 */
export const DEFAULT_HEARTS = 4;

/**
 * Default selected position used when initializing multi-letter columns.
 */
export const DEFAULT_COLUMN_POSITION = 1;

/**
 * Largest width, in pixels, a rotating passcode column (and its square
 * letter tiles) is allowed to grow to.
 */
export const MAX_COLUMN_WIDTH = 44;

/**
 * Smallest width, in pixels, a rotating passcode column (and its square
 * letter tiles) is allowed to shrink to, so even long passcodes keep every
 * column on screen without wrapping or scrolling.
 */
export const MIN_COLUMN_WIDTH = 10;

/**
 * Horizontal gap, in pixels, kept between adjacent passcode columns.
 */
export const COLUMN_GAP = 4;

/**
 * Total number of letter rows shown in each passcode column viewport.
 */
export const VISIBLE_ROWS = 5;

/**
 * Zero-based row index that marks the active letter position in the viewport.
 */
export const CENTER_ROW = 2;
