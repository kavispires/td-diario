import {
  gameIdToLocalTodayKey,
  loadLocalToday,
} from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type {
  DailyInvestigacaoEntry,
  DailyInvestigacaoStatement,
} from 'types/games';
import { gameInfo } from '../info';
import type { GameState } from './types';

/**
 * Number of optional clue hearts available at the start of every
 * Investigação puzzle.
 */
export const STARTING_HEARTS = 3;

const VALID_STATUSES = new Set(Object.values(GAME_LIFECYCLE_STATUS));

const FEATURE_PT_TRANSLATIONS: Dictionary<string> = {
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

/**
 * Options accepted by {@link getVisibleStatements}.
 */
type VisibleStatementsOptions = {
  /**
   * Main clue list for today's puzzle.
   */
  statements: DailyInvestigacaoStatement[];
  /**
   * Extra clue list revealed by spending hearts.
   */
  additionalStatements: DailyInvestigacaoStatement[];
  /**
   * Number of suspects already released.
   */
  releasedCount: number;
  /**
   * Remaining clue hearts.
   */
  hearts: number;
  /**
   * Whether the puzzle already reached a final state.
   */
  isComplete: boolean;
};

/**
 * Builds the default `GameState` for a fresh Investigação day.
 *
 * @param data - Today's Investigação challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyInvestigacaoEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    progress: 0,
    score: 0,
    hearts: STARTING_HEARTS,
    released: [],
  };
}

/**
 * Calculates Investigação's score from the number of innocents released,
 * remaining hearts, and whether the case was solved.
 *
 * @param releasedCount - How many innocents have already been released.
 * @param hearts - Remaining clue hearts.
 * @param isWin - Whether the case is solved.
 * @returns The score to persist for the current state.
 */
export function getScore(
  releasedCount: number,
  hearts: number,
  isWin: boolean,
): number {
  const releasePoints = releasedCount * 20;
  const cluePenalty = (STARTING_HEARTS - hearts) * 5;
  const completionBonus = isWin ? hearts * 10 + 20 : 0;

  return Math.max(releasePoints - cluePenalty + completionBonus, 0);
}

/**
 * Converts the current release count into a `0..1` completion fraction.
 *
 * @param releasedCount - How many innocents have been released.
 * @param totalSuspects - Total suspects shown in the grid.
 * @returns Puzzle progress from `0` to `1`.
 */
export function getProgress(
  releasedCount: number,
  totalSuspects: number,
): number {
  const releaseGoal = Math.max(totalSuspects - 1, 1);
  return Math.min(releasedCount / releaseGoal, 1);
}

/**
 * Validates that a restored local state still matches today's suspect list
 * and contains coherent progress values.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Investigação payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyInvestigacaoEntry): boolean {
  const suspectIds = new Set(data.suspects.map((suspect) => suspect.id));
  const releaseGoal = data.suspects.length - 1;
  const releasedIds = state.released;
  const releasedIdsAreUnique = new Set(releasedIds).size === releasedIds.length;

  return (
    typeof state.id === 'string' &&
    VALID_STATUSES.has(state.status) &&
    Number.isFinite(state.progress) &&
    Number.isFinite(state.score) &&
    Number.isInteger(state.hearts) &&
    state.hearts >= 0 &&
    state.hearts <= STARTING_HEARTS &&
    releasedIdsAreUnique &&
    releasedIds.length <= releaseGoal &&
    releasedIds.every((suspectId) => suspectIds.has(suspectId)) &&
    !releasedIds.includes(data.culpritId) &&
    (state.status !== GAME_LIFECYCLE_STATUS.WIN ||
      releasedIds.length === releaseGoal) &&
    (state.status !== GAME_LIFECYCLE_STATUS.LOSE || state.hearts === 0)
  );
}

/**
 * Retrieves today's Investigação state, restoring it from local storage
 * when it still matches today's payload, or building a fresh state
 * otherwise.
 *
 * @param data - Today's Investigação challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyInvestigacaoEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameIdToLocalTodayKey(gameInfo.id),
    dateId: data.id,
    defaultValue: defaultState,
  });

  if (!isValidState(restoredState, data)) {
    return defaultState;
  }

  const isWin = restoredState.status === GAME_LIFECYCLE_STATUS.WIN;

  return {
    ...restoredState,
    score: getScore(restoredState.released.length, restoredState.hearts, isWin),
    progress: getProgress(restoredState.released.length, data.suspects.length),
  };
}

/**
 * Resolves the portrait image id for a suspect using Investigação's `gb`
 * card variant.
 *
 * @param suspectId - Base suspect id from the payload.
 * @returns Image id consumable by {@link useTDImageCardUrl}.
 */
export function getSuspectImageCardId(suspectId: string): string {
  const splitId = suspectId.split('-');
  return `${splitId[0]}-gb-${splitId[splitId.length - 1]}`;
}

/**
 * Translates one suspect feature id into the Portuguese copy used by the
 * original Investigação client.
 *
 * @param feature - Feature id from the payload.
 * @param gender - Suspect gender, used for inflected variants.
 * @returns A player-facing Portuguese description of the feature.
 */
export function getFeatureLabel(feature: string, gender: string): string {
  return (
    FEATURE_PT_TRANSLATIONS[`${feature}.${gender}`] ??
    FEATURE_PT_TRANSLATIONS[feature] ??
    feature
  );
}

/**
 * Returns the clue lists currently visible to the player, matching the
 * original reveal cadence and reversed display order.
 *
 * @param options - Today's clue lists plus the current release/heart state.
 * @returns Visible main clues and visible extra clues.
 */
export function getVisibleStatements({
  statements,
  additionalStatements,
  releasedCount,
  hearts,
  isComplete,
}: VisibleStatementsOptions) {
  const visibleMainCount = isComplete
    ? statements.length
    : Math.floor(releasedCount / 2) + 1;
  const visibleAdditionalCount = isComplete
    ? additionalStatements.length
    : STARTING_HEARTS - hearts;

  return {
    visibleStatements: [...statements.slice(0, visibleMainCount)].reverse(),
    visibleAdditionalStatements: [
      ...additionalStatements.slice(0, visibleAdditionalCount),
    ].reverse(),
  };
}

/**
 * Reports whether every suspect excluded by a statement has already been
 * released.
 *
 * @param excludes - Suspect ids ruled out by one clue.
 * @param released - Suspect ids already released.
 * @returns Whether the clue is fully satisfied.
 */
export function isStatementComplete(
  excludes: string[],
  released: string[],
): boolean {
  return excludes.every((suspectId) => released.includes(suspectId));
}
