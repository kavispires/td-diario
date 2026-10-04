import type { DiagramArea, GameState } from './types';

/**
 * Weekday starting heart count and opening hand size for Conjuntos.
 */
export const CONJUNTOS_BASE_HEARTS = 4;

/**
 * Extra heart and hand-slot bonus applied to weekend challenges.
 */
export const CONJUNTOS_WEEKEND_EXTRA_HEARTS = 1;

/**
 * Points awarded for each remaining heart after a correct placement.
 */
export const CONJUNTOS_SCORE_PER_REMAINING_HEART = 10;

/**
 * Hearts removed after one incorrect placement.
 */
export const CONJUNTOS_WRONG_GUESS_HEART_PENALTY = 1;

/**
 * Minimum difficulty value shown in the header star meter.
 */
export const CONJUNTOS_MIN_DIFFICULTY_LEVEL = 1;

/**
 * Maximum difficulty value referenced by the star meter label.
 */
export const CONJUNTOS_MAX_DIFFICULTY_LEVEL = 5;

/**
 * Column count used to size the cards in the player's hand.
 */
export const CONJUNTOS_HAND_CARD_COLUMNS = 5;

/**
 * Horizontal margin reserved when measuring hand card widths.
 */
export const CONJUNTOS_HAND_CARD_MARGIN = 48;

/**
 * Gap between hand cards when measuring their responsive width.
 */
export const CONJUNTOS_HAND_CARD_GAP = 12;

/**
 * Maximum pixel width allowed for cards in the player's hand.
 */
export const CONJUNTOS_HAND_CARD_MAX_WIDTH = 82;

/**
 * Minimum pixel width allowed for cards in the player's hand.
 */
export const CONJUNTOS_HAND_CARD_MIN_WIDTH = 54;

/**
 * Width multiplier used for things rendered in the diagram intersection.
 */
export const CONJUNTOS_INTERSECTION_THING_WIDTH_MULTIPLIER = 0.95;

/**
 * Width multiplier applied to things rendered inside the diagram circles
 * (and, combined with {@link CONJUNTOS_INTERSECTION_THING_WIDTH_MULTIPLIER},
 * the intersection) so they read larger than the same-size hand cards.
 */
export const CONJUNTOS_DIAGRAM_THING_WIDTH_MULTIPLIER = 1.15;

/**
 * Width multiplier used to emphasize the most recently placed thing.
 */
export const CONJUNTOS_LATEST_THING_WIDTH_MULTIPLIER = 1.15;

/**
 * Width multiplier used for older things already placed in one area.
 */
export const CONJUNTOS_PREVIOUS_THING_WIDTH_MULTIPLIER = 0.8;

/**
 * Number of placed things after which older ones collapse to compact cards.
 */
export const CONJUNTOS_MINIMIZED_THINGS_THRESHOLD = 3;

/**
 * Width, in pixels, of the example cards shown in the results splash.
 */
export const CONJUNTOS_RESULTS_RULE_THING_WIDTH = 58;

/**
 * Default sprite width, in pixels, for a Conjuntos thing card.
 */
export const CONJUNTOS_THING_CARD_DEFAULT_WIDTH = 64;

/**
 * Minimum sprite width, in pixels, for a Conjuntos thing card.
 */
export const CONJUNTOS_THING_CARD_MIN_WIDTH = 35;

/**
 * Maximum sprite width, in pixels, for a Conjuntos thing card.
 */
export const CONJUNTOS_THING_CARD_MAX_WIDTH = 100;

/**
 * Diagram area id used by the shared intersection.
 */
export const CONJUNTOS_INTERSECTION_AREA = 0;

/**
 * Diagram area id used by the left yellow circle.
 */
export const CONJUNTOS_RULE1_AREA = 1;

/**
 * Diagram area id used by the right red circle.
 */
export const CONJUNTOS_RULE2_AREA = 2;

/**
 * Ordered list of every valid diagram area id accepted by the engine.
 */
export const CONJUNTOS_DIAGRAM_AREAS = [
  CONJUNTOS_INTERSECTION_AREA,
  CONJUNTOS_RULE1_AREA,
  CONJUNTOS_RULE2_AREA,
] as const;

/**
 * Day-of-week indices that activate Conjuntos' weekend variant.
 */
export const CONJUNTOS_WEEKEND_DAY_INDICES = [0, 6] as const;

/**
 * Number of seed things already visible on the board before play starts.
 */
export const CONJUNTOS_INITIAL_DIAGRAM_THINGS_COUNT = 3;

/**
 * Vowels counted when building Conjuntos' grammar tooltip summary.
 */
export const CONJUNTOS_VOWELS = 'aeiou';

/**
 * Human-readable label shown for each selectable diagram area.
 */
export const CONJUNTOS_AREA_LABELS: Record<DiagramArea, string> = {
  [CONJUNTOS_INTERSECTION_AREA]: 'na interseção',
  [CONJUNTOS_RULE1_AREA]: 'no círculo amarelo',
  [CONJUNTOS_RULE2_AREA]: 'no círculo vermelho',
};

/**
 * Background classes tinting each area's content preview (e.g. in the
 * placement confirmation modal) to match that area's circle color in the
 * diagram; the intersection blends both circle colors into a gradient.
 */
export const CONJUNTOS_AREA_BACKGROUND_CLASSES: Record<DiagramArea, string> = {
  [CONJUNTOS_INTERSECTION_AREA]:
    'bg-gradient-to-r from-[#ffd23f]/50 to-[#f15a24]/50',
  [CONJUNTOS_RULE1_AREA]: 'bg-[#ffd23f]/65',
  [CONJUNTOS_RULE2_AREA]: 'bg-[#f15a24]/65',
};

/**
 * State collection keys that store placed things for each diagram area.
 */
export const CONJUNTOS_AREA_THINGS_KEYS: Record<
  DiagramArea,
  keyof Pick<GameState, 'rule1Things' | 'rule2Things' | 'intersectingThings'>
> = {
  [CONJUNTOS_INTERSECTION_AREA]: 'intersectingThings',
  [CONJUNTOS_RULE1_AREA]: 'rule1Things',
  [CONJUNTOS_RULE2_AREA]: 'rule2Things',
};

/**
 * Emoji summary used in the shared result text for each guess outcome.
 */
export const CONJUNTOS_GUESS_RESULT_EMOJIS: Record<string, string> = {
  false: '✖️',
  [CONJUNTOS_INTERSECTION_AREA]: '🟠',
  [CONJUNTOS_RULE1_AREA]: '🟡',
  [CONJUNTOS_RULE2_AREA]: '🔴',
} as const;

/**
 * SVG viewport used by the interactive Conjuntos diagram.
 */
export const CONJUNTOS_DIAGRAM_VIEW_BOX = '0 0 760 500';

/**
 * Position and size of the left-circle hit area overlay.
 */
export const CONJUNTOS_LEFT_AREA_FRAME = {
  x: 30,
  y: 25,
  width: 250,
  height: 450,
} as const;

/**
 * Position and size of the right-circle hit area overlay.
 */
export const CONJUNTOS_RIGHT_AREA_FRAME = {
  x: 480,
  y: 25,
  width: 250,
  height: 450,
} as const;

/**
 * Position and size of the intersection hit area overlay.
 */
export const CONJUNTOS_INTERSECTION_AREA_FRAME = {
  x: 290,
  y: 65,
  width: 182,
  height: 370,
} as const;
