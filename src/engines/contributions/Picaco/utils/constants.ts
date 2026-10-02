/**
 * Game duration in seconds
 */
export const DURATION = 60;

/**
 * Number of drawings to be done
 */
export const DRAWINGS_COUNT = 6;

/**
 * Duration of each timed drawing round in seconds.
 */
export const ROUND_DURATION_SECONDS = DURATION / DRAWINGS_COUNT;

/**
 * Fixed SVG viewBox size used by Picaco's drawing board.
 */
export const CANVAS_VIEWBOX_SIZE = 500;

/**
 * Stroke width used when rendering Picaco drawings.
 */
export const STROKE_WIDTH = 5;

/**
 * Minimum serialized drawing length required before a sketch is sent to the
 * shared database, mirroring the original Picaco threshold.
 */
export const MIN_SAVED_DRAWING_LENGTH = 50;

/**
 * Separator used when composing unique save keys for submitted drawings.
 */
export const SAVE_KEY_SEPARATOR = ';;';
