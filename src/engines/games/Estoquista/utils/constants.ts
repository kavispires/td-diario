/**
 * Play phases used by Estoquista.
 */
export const ESTOQUISTA_PHASE = {
  STOCKING: 'stocking',
  FULFILLING: 'fulfilling',
} as const;

/**
 * Sentinel shelf index used for the dedicated "fora de estoque" slot.
 */
export const OUT_OF_STOCK_SHELF_INDEX = -1;

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
 * Size of the header hearts icon, in pixels.
 */
export const ESTOQUISTA_HEART_ICON_SIZE = 16;

/**
 * Duration of Estoquista's short layout and progress animations, in seconds.
 */
export const ESTOQUISTA_TRANSITION_DURATION = 0.2;

/**
 * Initial scale used when revealing the most recently stocked product.
 */
export const ESTOQUISTA_STOCKED_CARD_INITIAL_SCALE = 0.92;

/**
 * Ratio used to size placeholder package icons relative to a shelf cell.
 */
export const ESTOQUISTA_PACKAGE_ICON_SIZE_RATIO = 0.5;

/**
 * Minimum size for placeholder package icons, in pixels.
 */
export const ESTOQUISTA_PACKAGE_ICON_MIN_SIZE = 24;

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
 * Width multiplier applied to placed-order overlays on warehouse shelves.
 */
export const ESTOQUISTA_FULFILLMENT_CARD_WIDTH_RATIO = 0.58;

/**
 * Minimum width of a placed-order overlay card, in pixels.
 */
export const ESTOQUISTA_FULFILLMENT_CARD_MIN_WIDTH = 34;

/**
 * Minimum width of the dedicated out-of-stock card, in pixels.
 */
export const ESTOQUISTA_OUT_OF_STOCK_CARD_MIN_WIDTH = 68;

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
 * Points awarded every time the player stocks one product.
 */
export const ESTOQUISTA_STOCKING_SCORE = 1;

/**
 * Final progress value representing a fully completed run.
 */
export const ESTOQUISTA_COMPLETE_PROGRESS = 1;

/**
 * Bonus score multiplier applied to each remaining heart after a win.
 */
export const ESTOQUISTA_WIN_HEART_SCORE_MULTIPLIER = 25;

/**
 * Number of products described in Estoquista's rules copy.
 */
export const ESTOQUISTA_RULES_GOODS_COUNT = 16;

/**
 * Number of incoming orders described in Estoquista's rules copy.
 */
export const ESTOQUISTA_RULES_ORDERS_COUNT = 5;

/**
 * Number of orders described in the rules copy as actually present in stock.
 */
export const ESTOQUISTA_RULES_IN_STOCK_ORDERS_COUNT = 4;

/**
 * Starting hearts described in Estoquista's rules copy.
 */
export const ESTOQUISTA_RULES_STARTING_HEARTS = 4;

/**
 * Default title used for a locally-generated Estoquista puzzle, shown when
 * no themed title is available from the server.
 */
export const ESTOQUISTA_GENERATED_TITLE = 'Prateleira do Dia';

/**
 * Pool of verified item sprite ids available to draw a locally-generated
 * Estoquista puzzle from. Estoquista never arrives in the `dailyEngine`
 * response, so its daily payload is synthesized entirely on the client;
 * these ids are known-good sprite ids already used by other daily item
 * based games.
 */
export const ESTOQUISTA_ITEM_ID_POOL = [
  '0',
  '7',
  '55',
  '118',
  '124',
  '134',
  '138',
  '153',
  '165',
  '210',
  '219',
  '230',
  '287',
  '379',
  '389',
  '408',
  '458',
  '474',
  '517',
  '523',
  '530',
  '577',
  '621',
  '685',
  '729',
  '753',
  '762',
  '783',
  '793',
  '815',
  '839',
  '855',
  '871',
  '899',
  '932',
  '1021',
  '1046',
  '1049',
  '1085',
  '1117',
  '1212',
  '1217',
  '1233',
  '1255',
  '1270',
  '1358',
  '1393',
  '1432',
  '1593',
  '1702',
  '1748',
  '1751',
  '1825',
  '1827',
  '1917',
  '1932',
  '1937',
  '1972',
  '2037',
  '2059',
  '2082',
  '2100',
  '2151',
  '2254',
  '2290',
  '2488',
  '2507',
  '2547',
  '2564',
  '2767',
  '2774',
  '2836',
  '2981',
  '3003',
  '3030',
  '3063',
  '3118',
  '3141',
  '3218',
  '3278',
] as const;
