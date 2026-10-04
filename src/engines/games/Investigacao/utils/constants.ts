import { GAME_LIFECYCLE_STATUS } from '@utils/constants';

/**
 * Number of bonus clues available at the start of every Investigação run.
 */
export const STARTING_HEARTS = 3;

/**
 * Flat score bonus awarded when the player solves the case.
 */
export const WIN_COMPLETION_BONUS_POINTS = 10;

/**
 * Number of innocents that must be released to reveal another main clue.
 */
export const MAIN_STATEMENT_REVEAL_INTERVAL = 2;

/**
 * Image-card variant inserted into Investigação portrait asset ids.
 */
export const SUSPECT_IMAGE_CARD_VARIANT = 'gb';

/**
 * Trophy icon used in the share text when the player solves the case.
 */
export const SHARE_WIN_ICON = '🏆';

/**
 * Skull icon used in the share text when the player releases the culprit.
 */
export const SHARE_LOSE_ICON = '☠️';

/**
 * Lifecycle statuses accepted when restoring persisted Investigação state.
 */
export const VALID_STATUSES = new Set(Object.values(GAME_LIFECYCLE_STATUS));

/**
 * Number of columns shown in Investigação's suspect grid.
 */
export const SUSPECT_GRID_COLUMNS = 4;

/**
 * Horizontal margin budget reserved while sizing suspect cards.
 */
export const SUSPECT_GRID_MARGIN = 36;

/**
 * Gap between suspect cards in the responsive grid.
 */
export const SUSPECT_GRID_GAP = 10;

/**
 * Maximum width allowed for one suspect card in the grid.
 */
export const SUSPECT_GRID_MAX_WIDTH = 112;

/**
 * Minimum width allowed for one suspect card in the grid.
 */
export const SUSPECT_GRID_MIN_WIDTH = 64;

/**
 * Delay step used to stagger suspect-card entry animations.
 */
export const SUSPECT_CARD_ANIMATION_DELAY_STEP = 0.04;

/**
 * Vertical offset used when suspect cards animate into view.
 */
export const SUSPECT_CARD_ANIMATION_Y_OFFSET = 12;

/**
 * Duration, in seconds, of each suspect-card entry animation.
 */
export const SUSPECT_CARD_ANIMATION_DURATION_SECONDS = 0.2;

/**
 * Delay step used to stagger statement-card entry animations.
 */
export const STATEMENT_CARD_ANIMATION_DELAY_STEP = 0.04;

/**
 * Vertical offset used when statement cards animate into view.
 */
export const STATEMENT_CARD_ANIMATION_Y_OFFSET = 10;

/**
 * Duration, in seconds, of each statement-card entry animation.
 */
export const STATEMENT_CARD_ANIMATION_DURATION_SECONDS = 0.18;

/**
 * Portuguese copy for each Investigação suspect feature tag.
 */
export const FEATURE_PT_TRANSLATIONS: Dictionary<string> = {
  male: 'é homem',
  female: 'é mulher',
  transgender: 'é transgênero',
  none: 'não possui gênero',
  fluid: 'é de gênero fluido',
  'non-binary': 'é não-binário(a)',
  other: 'é de um gênero diferente/desconhecido',
  black: 'é negro(a)',
  'black.male': 'é negro',
  'black.female': 'é negra',
  'black.non-binary': 'é negre',
  caucasian: 'é branco(a)',
  'caucasian.male': 'é branco',
  'caucasian.female': 'é branca',
  'caucasian.non-binary': 'é branque',
  white: 'é branco(a)',
  'white.male': 'é branco',
  'white.female': 'é branca',
  'white.non-binary': 'é branque',
  asian: 'é asiático(a)',
  'asian.male': 'é asiático',
  'asian.female': 'é asiática',
  'asian.non-binary': 'é asiaique',
  latino: 'é latino(a)',
  'latino.male': 'é latino',
  'latino.female': 'é latina',
  'latino.non-binary': 'é latinex',
  brown: 'é pardo(a)',
  'brown.male': 'é pardo',
  'brown.female': 'é parda',
  'brown.non-binary': 'é parde',
  thin: 'é magrelo(a)',
  'thin.male': 'é magrelo',
  'thin.female': 'é magrela',
  'thin.non-binary': 'é magrele',
  fat: 'é gordo(a)',
  'fat.male': 'é gordo',
  'fat.female': 'é gorda',
  'fat.non-binary': 'é gordix',
  large: 'é gordo(a)',
  'large.male': 'é gordo',
  'large.female': 'é gorda',
  'large.non-binary': 'é gordix',
  tall: 'é alto(a)',
  'tall.male': 'é alto',
  'tall.female': 'é alta',
  'tall.non-binary': 'é altix',
  short: 'é baixinho(a)',
  'short.male': 'é baixinho',
  'short.female': 'é baixinha',
  'short.non-binary': 'é baixinhe',
  young: 'é jovem',
  undefinedAge: 'sem idade definida',
  adult: 'é adulto(a)',
  'adult.male': 'é adulto',
  'adult.female': 'é adulta',
  'adult.non-binary': 'é adultx',
  senior: 'é idoso(a)',
  'senior.male': 'é idoso',
  'senior.female': 'é idosa',
  'senior.non-binary': 'é idose',
  average: 'tem corpo normal',
  medium: 'é de altura média',
  mixed: 'é mestiço(a)',
  'mixed.male': 'é mestiço',
  'mixed.female': 'é mestiça',
  'mixed.non-binary': 'é mestice',
  indigenous: 'é indígena',
  hat: 'está usando um chapéu',
  tie: 'está usando uma gravata',
  glasses: 'está usando óculos',
  brownHair: 'tem cabelo castanho',
  shortHair: 'tem cabelo curto',
  beard: 'tem barba',
  scarf: 'está usando um cachecol',
  blondeHair: 'tem cabelo loiro',
  longHair: 'tem cabelo longo',
  greyHair: 'tem cabelo grisalho',
  bald: 'é careca',
  suspenders: 'está usando suspensório',
  zipper: 'tem zíper na roupa',
  mustache: 'tem bigode',
  goatee: 'tem cavanhaque',
  muscular: 'é sarado(a)',
  'muscular.male': 'é sarado',
  'muscular.female': 'é sarada',
  'muscular.non-binary': 'é sarade',
  blackHair: 'tem cabelo preto',
  hoodie: 'está usando um moletom',
  earrings: 'está usando brincos',
  lipstick: 'está usando batom',
  necklace: 'está usando um colar',
  mediumHair: 'tem cabelo médio',
  'middle-eastern': 'é do Oriente Médio',
  headscarf: 'está usando um lenço na cabeça',
  redHair: 'tem cabelo ruivo',
  piercings: 'tem piercings',
  coloredHair: 'tem cabelo colorido',
  indian: 'é indiano(a)',
  'indian.male': 'é indiano',
  'indian.female': 'é indiana',
  'indian.non-binary': 'é indiane',
  'native-american': 'é nativo-americano(a)',
  noAccessories: 'está sem nenhum acessório',
  avoidingCamera: 'está evitando olhar para a câmera',
  wearingStripes: 'tem listras na roupa',
  blackClothes: 'está vestindo roupas pretas',
  blueClothes: 'está vestindo roupas azuis',
  greenClothes: 'está vestindo roupas verdes',
  redClothes: 'está vestindo roupas vermelhas',
  yellowClothes: 'está vestindo roupas amarelas',
  purpleClothes: 'está vestindo roupas roxas',
  orangeClothes: 'está vestindo roupas laranjas',
  brownClothes: 'está vestindo roupas marrons',
  whiteShirt: 'está usando camisa branca',
  pinkClothes: 'está vestindo roupas rosas',
  beigeClothes: 'está vestindo roupas bege',
  greyClothes: 'está vestindo roupas cinzas',
  patternedShirt: 'está usando roupa estampada',
  buttonShirt: 'está usando camisa com botões',
  bow: 'está usando um laço',
  hairyChest: 'está mostrando o peito peludo',
  wearingFlowers: 'está usando flores',
  showTeeth: 'está mostrando os dentes',
  hairTie: 'está usando um xuxinha ou fita no cabelo',
  shirtless: 'está provavelmente sem camisa',
  noHairInfo: 'não dá pra saber direito sobre o cabelo',
  holdingSomething: 'está segurando algo',
  turtleNeck: 'está usando gola rolê',
};
