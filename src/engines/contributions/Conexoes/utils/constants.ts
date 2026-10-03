/**
 * Minimum number of image ids required for a valid Conexões entry.
 */
export const MIN_ENTRY_IMAGE_IDS = 2;

/**
 * Number of image cards shown for each Conexões pair.
 */
export const PAIR_CARD_COUNT = 2;

/**
 * Minimum number of pairs a player must evaluate before finishing the day.
 */
export const MIN_REQUIRED_PAIRS = 10;

/**
 * Number of new pairs generated each time Conexões refills the queue.
 */
export const GENERATED_PAIRS_BATCH_SIZE = 20;

/**
 * Points awarded for every pair the player marks as related.
 */
export const RELATED_PAIR_SCORE = 10;

/**
 * Separator used to build stable ids for unordered image pairs.
 */
export const PAIR_ID_SEPARATOR = '::';

/**
 * Gap, in pixels, between the two image cards in the active pair layout.
 */
export const PAIR_CARD_GAP = 20;

/**
 * Horizontal margin, in pixels, reserved around the active pair layout.
 */
export const PAIR_CARD_MARGIN = 24;

/**
 * Maximum width, in pixels, allowed for each active pair image card.
 */
export const PAIR_CARD_MAX_WIDTH = 160;

/**
 * Minimum width, in pixels, allowed for each active pair image card.
 */
export const PAIR_CARD_MIN_WIDTH = 112;

/**
 * Prefix used for the mutation key that saves related Conexões pairs.
 */
export const CONEXOES_SAVE_MUTATION_KEY = 'conexoes-save-pairs';

/**
 * Horizontal drag distance, in pixels, required to confirm a swipe answer.
 */
export const SWIPE_THRESHOLD = 120;

/**
 * Horizontal drag distance, in pixels, required before showing a swipe hint.
 */
export const SWIPE_HINT_THRESHOLD = 32;

/**
 * Elasticity applied to the swipe card while dragging.
 */
export const SWIPE_CARD_DRAG_ELASTIC = 0.75;

/**
 * Vertical offset, in pixels, used when the swipe card animates into view.
 */
export const SWIPE_CARD_ENTRY_OFFSET_Y = 12;

/**
 * Duration, in seconds, of the swipe card entrance animation.
 */
export const SWIPE_CARD_ANIMATION_DURATION_SECONDS = 0.2;

/**
 * Background colors shown while swiping left, resting, or swiping right.
 */
export const SWIPE_BACKGROUND_COLORS: string[] = [
  'rgba(244, 63, 94, 0.18)',
  'rgba(255, 255, 255, 0)',
  'rgba(234, 179, 8, 0.24)',
];

/**
 * Width, in pixels, used by each image card shown in the results splash.
 */
export const RESULTS_PAIR_CARD_WIDTH = 120;
