/**
 * Play phases used by Estoquista.
 */
export const ESTOQUISTA_PHASE = {
  STOCKING: 'stocking',
  FULFILLING: 'fulfilling',
} as const;

/**
 * Number of visible columns in Estoquista's warehouse grid.
 */
export const ESTOQUISTA_BOARD_COLUMNS = 4;

/**
 * Card-width measurement settings used to size the responsive warehouse grid.
 */
export const ESTOQUISTA_CARD_WIDTH_CONFIG = {
  margin: 48,
  gap: 12,
  maxWidth: 80,
  minWidth: 56,
} as const;

/**
 * Shared grid container classes reused by both the stocking and fulfillment
 * boards so the two phases always look the same.
 */
export const ESTOQUISTA_BOARD_GRID_CLASSNAME =
  'grid gap-2 rounded-[2rem] bg-amber-900/80 p-3 shadow-inner';

/**
 * Shared "idle" shelf cell classes (static, non-actionable or already
 * filled), reused by both the stocking and fulfillment boards.
 */
export const ESTOQUISTA_CELL_IDLE_CLASSNAME =
  'rounded-2xl border border-amber-950/50 bg-black/25 text-amber-50';

/**
 * Shared "interactive" shelf cell classes (dashed border, inviting a tap or
 * drop), reused by both the stocking and fulfillment boards.
 */
export const ESTOQUISTA_CELL_INTERACTIVE_CLASSNAME =
  'rounded-2xl border-2 border-dashed border-amber-100/60 bg-black/25 text-white transition-colors hover:bg-black/35';

/**
 * Size of the header hearts icon, in pixels.
 */
export const ESTOQUISTA_HEART_ICON_SIZE = 16;

/**
 * Duration of Estoquista's short layout and progress animations, in seconds.
 */
export const ESTOQUISTA_TRANSITION_DURATION = 0.2;

/**
 * Ratio used to size placeholder package icons relative to a shelf cell.
 */
export const ESTOQUISTA_PACKAGE_ICON_SIZE_RATIO = 0.5;

/**
 * Minimum size for placeholder package icons, in pixels.
 */
export const ESTOQUISTA_PACKAGE_ICON_MIN_SIZE = 24;

/**
 * Scale used at the start/end of the crossfade between a stocked item card
 * and its anonymous package icon.
 */
export const ESTOQUISTA_PACKAGE_MORPH_SCALE = 0.4;

/**
 * Rotation applied to an order placed on top of a shelf, so it reads as a
 * temporary sticky-note-style placement rather than the shelf's real good.
 */
export const ESTOQUISTA_ORDER_PLACEMENT_ROTATION = -6;

/**
 * Spring transition used for the shared-layout "flight" animation that
 * carries the current good from its preview card into the shelf it was
 * placed on.
 */
export const ESTOQUISTA_GOOD_LAYOUT_TRANSITION = {
  layout: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 20,
  },
  opacity: {
    duration: ESTOQUISTA_TRANSITION_DURATION,
    ease: 'easeInOut' as const,
  },
};

/**
 * How long the last stocked item stays visible before morphing into its
 * package icon, in milliseconds.
 */
export const ESTOQUISTA_LAST_GOOD_HIGHLIGHT_DELAY = 400;

/**
 * Delay before advancing from the stocking phase to the fulfillment phase
 * after the last good is placed, in milliseconds.
 */
export const ESTOQUISTA_PHASE_TRANSITION_DELAY = 2000;

/**
 * Width multiplier used by the "produto atual" preview card.
 */
export const ESTOQUISTA_CURRENT_GOOD_WIDTH_RATIO = 1.35;

/**
 * Maximum width allowed for the "produto atual" preview card, in pixels.
 */
export const ESTOQUISTA_CURRENT_GOOD_MAX_WIDTH = 100;

/**
 * Width multiplier applied to order cards relative to one shelf cell.
 */
export const ESTOQUISTA_ORDER_CARD_WIDTH_RATIO = 0.88;

/**
 * Minimum width of an order card, in pixels.
 */
export const ESTOQUISTA_ORDER_CARD_MIN_WIDTH = 48;

/**
 * Inner padding applied to each warehouse good card sprite, in pixels.
 */
export const ESTOQUISTA_ITEM_CARD_PADDING = 10;

/**
 * Hearts deducted by one wrong submission or manual reset.
 */
export const ESTOQUISTA_HEART_PENALTY = 1;

/**
 * Minimum amount of hearts the puzzle must grant for a day.
 */
export const ESTOQUISTA_MINIMUM_HEARTS = 1;

/**
 * Number of orders per day that intentionally have no matching stocked item.
 */
export const ESTOQUISTA_OUT_OF_STOCK_ORDER_COUNT = 1;

/**
 * Extra progress step reserved for the final submission action.
 */
export const ESTOQUISTA_FINAL_SUBMISSION_PROGRESS_STEPS = 1;

/**
 * Final progress value representing a fully completed run.
 */
export const ESTOQUISTA_COMPLETE_PROGRESS = 1;

/**
 * Score multiplier applied once, at the end of the game (win or loss), to
 * remaining hearts times correctly delivered orders.
 */
export const ESTOQUISTA_FINAL_SCORE_MULTIPLIER = 5;

/**
 * Number of orders described in the rules copy as actually present in stock.
 */
export const ESTOQUISTA_RULES_IN_STOCK_ORDERS_COUNT = 4;

/**
 * Starting hearts described in Estoquista's rules copy.
 */
export const ESTOQUISTA_RULES_STARTING_HEARTS = 4;
