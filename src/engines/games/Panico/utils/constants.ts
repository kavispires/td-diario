/**
 * Number of hearts available at the start of each Panico run.
 */
export const PANICO_TOTAL_HEARTS = 5;

/**
 * Minimum buttons cleared in a run for it to be considered share-eligible
 * (`GAME_LIFECYCLE_STATUS.TRIED`) on the hub, even though the player can
 * keep retrying in-game until they run out of hearts or reach the end of
 * today's sequence.
 */
export const HUB_COMPLETION_BUTTON_THRESHOLD = 1;

/**
 * Delay, in milliseconds, shown between resolved buttons.
 */
export const PANICO_PROCESSING_DELAY_MS = 1_000;

/**
 * Longer intro delay, in milliseconds, shown before the first button appears.
 */
export const PANICO_START_DELAY_MS = 2_000;

/**
 * Sentinel index used when no Panico button is currently active.
 */
export const INITIAL_ACTIVE_BUTTON_INDEX = -1;

/**
 * Separator used to decode each encoded Panico button payload.
 */
export const BUTTON_SEPARATOR = '::';

/**
 * Countdown duration, in seconds, for each Panico button timing tier.
 */
export const DURATION_MAP = {
  quick: 4,
  normal: 6,
  long: 9,
} as const;
