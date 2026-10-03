/**
 * Number of items that make up a valid Quartetos selection.
 */
export const QUARTETOS_GROUP_SIZE = 4;

/**
 * Number of hidden quartets each Quartetos challenge contains.
 */
export const QUARTETOS_QUARTETS_PER_PUZZLE = 4;

/**
 * Multiplier applied to the remaining hearts to score each correct quartet
 * (including the winning one).
 */
export const CORRECT_GUESS_SCORE = 5;

/**
 * Flat bonus points awarded once, on top of the usual per-quartet score,
 * when the final quartet is found.
 */
export const WIN_BONUS_SCORE = 10;

/**
 * Emoji palette used to render shared results by quartet difficulty level.
 */
export const QUARTETOS_SHARE_LEVEL_EMOJIS = ['🟩', '🟨', '🟧', '🟪'] as const;

/**
 * Tailwind classes used to color a solved quartet according to its set
 * order (not the order the player found it in): green, yellow, orange, then
 * purple, matching {@link QUARTETOS_SHARE_LEVEL_EMOJIS}.
 */
export const QUARTETOS_LEVEL_COLOR_CLASSES = [
  { surface: 'border-green-400/50 bg-green-100', item: 'bg-green-50' },
  { surface: 'border-yellow-400/50 bg-yellow-100', item: 'bg-yellow-50' },
  { surface: 'border-orange-400/50 bg-orange-100', item: 'bg-orange-50' },
  { surface: 'border-purple-400/50 bg-purple-100', item: 'bg-purple-50' },
] as const;

/**
 * Fallback emoji used when a shared-result item cannot be mapped to a quartet.
 */
export const QUARTETOS_SHARE_UNKNOWN_EMOJI = '❓';

/**
 * Shared Motion transition used to animate items changing places, both when
 * shuffling the grid and when a correct quartet moves its items out of it.
 */
export const QUARTETOS_ITEM_LAYOUT_TRANSITION = {
  type: 'tween',
  duration: 0.45,
  ease: 'easeInOut',
} as const;

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
