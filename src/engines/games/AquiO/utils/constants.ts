/**
 * Number of matching disc pairs the player must solve to clear today's run.
 */
export const GOAL = 15;

/**
 * Total mistakes the player can make across today's attempts before losing.
 */
export const HEARTS = 3;

/**
 * Length of one timed round before it ends automatically.
 */
export const ROUND_DURATION_SECONDS = 60;

/**
 * Slot indexes used to distribute items across a disc's 3x3 playable area.
 */
export const DISC_POSITIONS = Array.from({ length: 9 }, (_, index) => index);

/**
 * Relative item scales shuffled onto each disc to vary the composition.
 */
export const DISC_SIZES = [100, 90, 110, 80, 105, 130, 120, 150, 115] as const;

/**
 * Stacking order assigned to each disc-item size when sprites overlap.
 */
export const Z_INDEX_BY_SIZE: Record<number, number> = {
  80: 7,
  90: 6,
  100: 5,
  105: 4,
  110: 3,
  115: 0,
  120: 2,
  130: 1,
  150: 0,
};

/**
 * Exclusive upper bound used when generating a random full-circle rotation.
 */
export const DISC_ROTATION_MAX_EXCLUSIVE = 361;

/**
 * Number of items placed on the first disc during a standard round.
 */
export const INITIAL_DISC_ITEM_COUNT = 8;

/**
 * Number of items placed on the first disc during a weekend round.
 */
export const WEEKEND_INITIAL_DISC_ITEM_COUNT = 9;

/**
 * Number of brand-new items introduced on each later standard disc.
 */
export const FOLLOW_UP_DISC_NEW_ITEM_COUNT = 7;

/**
 * Number of brand-new items introduced on each later weekend disc.
 */
export const WEEKEND_FOLLOW_UP_DISC_NEW_ITEM_COUNT = 8;

/**
 * Total discs generated up front so every required pair exists for the round.
 */
export const DISC_SEQUENCE_LENGTH = 17;

/**
 * Points multiplier awarded when the player pushes their record forward.
 */
export const CORRECT_MATCH_SCORE = 10;

/**
 * Larger points multiplier awarded when the record-setting match wins the run.
 */
export const WIN_MATCH_SCORE = 20;

/**
 * Interval between timer refreshes while an Aqui O round is active.
 */
export const TIMER_TICK_INTERVAL_MS = 100;

/**
 * Language used by the optional spoken feedback during gameplay.
 */
export const SPEECH_LANGUAGE = 'pt-BR';

/**
 * Speed used for spoken feedback so item names remain easy to understand.
 */
export const SPEECH_RATE = 1;

/**
 * CSS grid slot classes for each playable position inside one disc.
 */
export const DISC_POSITION_CLASSES: Record<number, string> = {
  0: 'col-start-2 row-start-2',
  1: 'col-start-3 row-start-2',
  2: 'col-start-4 row-start-2',
  3: 'col-start-2 row-start-3',
  4: 'col-start-3 row-start-3',
  5: 'col-start-4 row-start-3',
  6: 'col-start-2 row-start-4',
  7: 'col-start-3 row-start-4',
  8: 'col-start-4 row-start-4',
} as const;

/**
 * Results-splash headings ordered from the weakest to the strongest outcome.
 */
export const RESULTS_TITLES = [
  'Você é muito ruim!',
  'Foi bem mais ou menos!',
  'Muito bom!',
  'Quase lá!',
  'Incrível!',
] as const;

/**
 * Maximum progress that still uses the weakest results-splash heading.
 */
export const LOW_RESULTS_TITLE_PROGRESS_THRESHOLD = 3;

/**
 * Maximum progress that still uses the second results-splash heading.
 */
export const MEDIUM_RESULTS_TITLE_PROGRESS_THRESHOLD = 10;

/**
 * Maximum progress that still uses the third results-splash heading.
 */
export const HIGH_RESULTS_TITLE_PROGRESS_THRESHOLD = 12;

/**
 * Number of solved discs represented by each recap item preview in the splash.
 */
export const RESULTS_PREVIEW_GROUP_SIZE = 3;

/**
 * Number of today's available items previewed before the player starts a run.
 */
export const PRELOAD_ITEMS_LIMIT = GOAL;
