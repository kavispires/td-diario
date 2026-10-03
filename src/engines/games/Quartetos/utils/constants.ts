/**
 * Number of items that make up a valid Quartetos selection.
 */
export const QUARTETOS_GROUP_SIZE = 4;

/**
 * Number of hidden quartets each Quartetos challenge contains.
 */
export const QUARTETOS_QUARTETS_PER_PUZZLE = 4;

/**
 * Points awarded for each correct quartet found before the final solve.
 */
export const CORRECT_GUESS_SCORE = 5;

/**
 * Bonus points awarded per remaining heart when the puzzle is completed.
 */
export const WIN_BONUS_SCORE = 10;

/**
 * Emoji palette used to render shared results by quartet difficulty level.
 */
export const QUARTETOS_SHARE_LEVEL_EMOJIS = ['🟩', '🟨', '🟧', '🟪'] as const;

/**
 * Fallback emoji used when a shared-result item cannot be mapped to a quartet.
 */
export const QUARTETOS_SHARE_UNKNOWN_EMOJI = '❓';

/**
 * Layout settings used to size the responsive Quartetos item cards.
 */
export const QUARTETOS_CARD_WIDTH_SETTINGS = {
  margin: 48,
  gap: 12,
  maxWidth: 96,
  minWidth: 55,
} as const;

/**
 * Icon size used by the hearts counter in the Quartetos header stats.
 */
export const QUARTETOS_HEART_ICON_SIZE = 16;

/**
 * Horizontal offsets used by the grid shake animation after a wrong attempt.
 */
export const QUARTETOS_GRID_SHAKE_KEYFRAMES: number[] = [0, -8, 8, -6, 6, 0];

/**
 * Duration of the wrong-attempt grid shake animation in seconds.
 */
export const QUARTETOS_GRID_SHAKE_ANIMATION_DURATION_SECONDS = 0.32;

/**
 * Fixed item width used when rendering quartet cards in the results splash.
 */
export const QUARTETOS_RESULTS_ITEM_WIDTH = 56;
