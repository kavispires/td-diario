import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import {
  generateShareableResult,
  writeHeartResultString,
} from '@utils/shareResults';
import type {
  DailyInvestigacaoEntry,
  DailyInvestigacaoStatement,
} from 'types/games';
import { gameInfo } from '../info';
import {
  FEATURE_PT_TRANSLATIONS,
  MAIN_STATEMENT_REVEAL_INTERVAL,
  SHARE_LOSE_ICON,
  SHARE_WIN_ICON,
  STARTING_HEARTS,
  SUSPECT_IMAGE_CARD_VARIANT,
  VALID_STATUSES,
} from './constants';
import type { GameState } from './types';

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
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  if (!isValidState(restoredState, data)) {
    return defaultState;
  }

  return {
    ...restoredState,
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
  return `${splitId[0]}-${SUSPECT_IMAGE_CARD_VARIANT}-${splitId[splitId.length - 1]}`;
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
    : Math.floor(releasedCount / MAIN_STATEMENT_REVEAL_INTERVAL) + 1;
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

/**
 * Builds the shareable result for today's Investigação run.
 *
 * @param options - Today's challenge number and final suspect-release state.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  hearts,
  totalHearts,
  releasedCount,
  totalSuspects,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  totalHearts: number;
  releasedCount: number;
  totalSuspects: number;
  score: number;
}): ShareResult {
  const releaseGoal = totalSuspects - 1;
  const winIcon =
    releasedCount === releaseGoal ? SHARE_WIN_ICON : SHARE_LOSE_ICON;
  const progress = Math.round((releasedCount / releaseGoal) * 100);

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts,
    remainingHearts: hearts,
    additionalLines: [
      `${winIcon} ${writeHeartResultString(hearts, totalHearts)} (${progress}% | ${score}pts)`,
    ],
    hideHearts: true,
  });
}

/**
 * Recreates Investigação's shareable result using only today's challenge
 * payload and persisted progress, without mounting the game engine or
 * results UI.
 *
 * @param data - Today's Investigação challenge payload.
 * @param state - Persisted Investigação progress for today's challenge.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShareFromProgress(
  data: DailyInvestigacaoEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    hearts: state.hearts,
    totalHearts: STARTING_HEARTS,
    releasedCount: state.released.length,
    totalSuspects: data.suspects.length,
    score: state.score,
  });
}
