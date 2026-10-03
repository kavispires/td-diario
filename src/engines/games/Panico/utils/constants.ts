/**
 * Number of hearts available at the start of each Panico run.
 */
export const PANICO_TOTAL_HEARTS = 5;

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
