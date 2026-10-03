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
 * Corner radius applied to Picaco's SVG drawing surface.
 */
export const CANVAS_CORNER_RADIUS = 32;

/**
 * Fill color used by Picaco's drawing surface and previews.
 */
export const CANVAS_FILL_COLOR = 'white';

/**
 * Stroke color used when rendering Picaco drawings.
 */
export const CANVAS_STROKE_COLOR = '#111827';

/**
 * Stroke width used when rendering Picaco drawings.
 */
export const STROKE_WIDTH = 5;

/**
 * Countdown interval used to update Picaco's round timer.
 */
export const COUNTDOWN_TICK_MS = 1000;

/**
 * Points awarded for each card level when a drawing is worth saving.
 */
export const SCORE_PER_LEVEL = 10;

/**
 * Minimum serialized drawing length required before a sketch is sent to the
 * shared database, mirroring the original Picaco threshold.
 */
export const MIN_SAVED_DRAWING_LENGTH = 50;

/**
 * Separator used when composing unique save keys for submitted drawings.
 */
export const SAVE_KEY_SEPARATOR = ';;';
