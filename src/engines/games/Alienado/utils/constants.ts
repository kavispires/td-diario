/**
 * Stable slug used when Alienado needs to identify itself to shared helpers.
 */
export const ALIENADO_GAME_ID = 'alienado';

/**
 * Number of delivery slots the player fills during each Alienado round.
 */
export const ALIENADO_REQUEST_COUNT = 4;

/**
 * Responsive sizing rules for the item cards shown throughout Alienado.
 */
export const ALIENADO_CARD_WIDTH_CONFIG = {
  margin: 36,
  gap: 10,
  maxWidth: 78,
  minWidth: 54,
} as const;

/**
 * Icon size used for the heart counter in Alienado's stats row.
 */
export const ALIENADO_STATS_HEART_SIZE = 16;

/**
 * Message shown when the player needs to pick a slot before swapping items.
 */
export const ALIENADO_SELECT_SLOT_MESSAGE =
  'Escolha uma posição para trocar um item.';

/**
 * Message shown when the player resubmits a combination that was already tried.
 */
export const ALIENADO_DUPLICATE_GUESS_MESSAGE =
  'Você já tentou essa combinação. Tente outra!';

/**
 * Message shown after submitting an incorrect delivery combination.
 */
export const ALIENADO_INCORRECT_GUESS_MESSAGE =
  'Combinação incorreta. Tente novamente!';

/**
 * Score multiplier applied to each remaining heart when the player wins.
 */
export const ALIENADO_SCORE_PER_REMAINING_HEART = 25;

/**
 * Delimiter used to persist and restore Alienado guesses as joined item ids.
 */
export const ALIENADO_GUESS_DELIMITER = '-';

/**
 * Per-slot emoji markers used when building Alienado's shareable result grid.
 */
export const ALIENADO_SHARE_POSITION_EMOJIS = ['🟤', '🟡', '🔵', '🟣'] as const;

/**
 * Emoji shown in the share result when an item exists in the solution but sits in the wrong slot.
 */
export const ALIENADO_SHARE_PRESENT_EMOJI = '❌';

/**
 * Emoji shown in the share result when an item never appears in today's solution.
 */
export const ALIENADO_SHARE_ABSENT_EMOJI = '👽';

/**
 * Suggested attribute categories shown in Alienado's rules overlay.
 */
export const ALIENADO_ATTRIBUTE_HINT_GROUPS = [
  {
    title: 'Mais comuns',
    hints: [
      'Afiado',
      'Arma',
      'Brinquedo',
      'Comida',
      'Frio',
      'Planta',
      'Quente',
      'Transporte',
      'Vestimenta',
      'Voo',
    ],
  },
  {
    title: 'Um pouco mais traiçoeiros',
    hints: [
      'Brilho/Luz',
      'Construção',
      'Escrita',
      'Humano',
      'Líquido',
      'Madeira',
      'Máquina',
      'Metal',
      'Recipiente',
      'Tecnologia',
    ],
  },
  {
    title: 'Os caóticos',
    hints: [
      'Acessórios',
      'Cheiro/Fedor',
      'Ferramenta',
      'Fragilidade',
      'Instrumento/Utensílio',
      'Parte/Pedaço',
      'Som',
      'Tabu/Polêmico',
    ],
  },
] as const;

/**
 * Horizontal offsets used by the board shake animation after invalid attempts.
 */
export const ALIENADO_BOARD_SHAKE_X: number[] = [0, -8, 8, -6, 6, 0];

/**
 * Duration of the board shake animation in seconds.
 */
export const ALIENADO_BOARD_SHAKE_DURATION_SECONDS = 0.3;

/**
 * Inner inset applied so alien sign sprites sit comfortably inside their tile.
 */
export const ALIENADO_SIGN_SPRITE_INSET = 12;

/**
 * Sizing rules for example items displayed in the alien dictionary.
 */
export const ALIENADO_DICTIONARY_ITEM_FRAME = {
  widthOffset: 4,
  padding: 2,
} as const;

/**
 * Sizing rules for request slots and previous guesses on the main board.
 */
export const ALIENADO_BOARD_ITEM_FRAME = {
  padding: 4,
  requestSignWidthOffset: 10,
  requestSignMinWidth: 42,
  emptySlotSize: 76,
  historyWidthOffset: 12,
  historyMinWidth: 38,
  historyPadding: 3,
} as const;

/**
 * Sizing rules for recap content displayed in Alienado's results splash.
 */
export const ALIENADO_RESULTS_LAYOUT = {
  requestSignWidth: 46,
  requestItemWidth: 60,
  requestItemPadding: 4,
  attributeSignWidth: 44,
  guessItemWidth: 38,
  guessItemPadding: 3,
} as const;
