import {
  gameIdToLocalTodayKey,
  loadLocalToday,
} from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyConexoesEntry } from 'types/games';
import { gameInfo } from '../info';
import type {
  GameState,
  PairToEvaluate,
  RelatedPair,
  SavePayload,
} from './types';

/**
 * Minimum number of pairs a player must evaluate before Conexões can be
 * saved or closed for the day.
 */
export const MIN_REQUIRED_PAIRS = 10;

/**
 * Number of pairs generated at a time for the current run.
 */
export const GENERATED_PAIRS_BATCH_SIZE = 20;

/**
 * Builds a stable id for an unordered pair of image ids.
 *
 * @param imageId1 - One image id in the pair.
 * @param imageId2 - The other image id in the pair.
 * @returns The pair id in canonical sorted order.
 */
export function createPairId(imageId1: string, imageId2: string): string {
  return [imageId1, imageId2].sort().join('::');
}

/**
 * Converts one related pair into the backend payload shape expected by
 * `SAVE_CONEXOES`.
 *
 * @param pairs - Related pairs gathered during today's run.
 * @returns The save payload.
 */
export function buildSavePayload(pairs: RelatedPair[]): SavePayload {
  return {
    pairs: pairs.map(({ imageId1, imageId2 }) => ({ imageId1, imageId2 })),
  };
}

/**
 * Computes Conexões' score from the number of related pairs found so far.
 *
 * @param relatedPairsCount - Count of related pairs accumulated in state.
 * @returns The score shown to the player.
 */
export function getScore(relatedPairsCount: number): number {
  return relatedPairsCount * 10;
}

/**
 * Computes Conexões' progress against the minimum evaluation quota.
 *
 * @param evaluatedCount - Number of pairs already evaluated.
 * @returns Progress from `0` to `1`.
 */
export function getProgress(evaluatedCount: number): number {
  return Math.min(evaluatedCount / MIN_REQUIRED_PAIRS, 1);
}

/**
 * Generates a balanced batch of unique image pairs, favoring the least-used
 * images while avoiding any pair ids already seen in the current run.
 *
 * @param imageIds - Pool of image ids available for today's run.
 * @param excludedPairIds - Pair ids that must not be repeated.
 * @param batchSize - Maximum number of pairs to generate.
 * @returns New unique pairs ready to evaluate.
 */
export function generatePairs(
  imageIds: string[],
  excludedPairIds: ReadonlySet<string>,
  batchSize = GENERATED_PAIRS_BATCH_SIZE,
): PairToEvaluate[] {
  const uniqueImageIds = [...new Set(imageIds)];
  const pairs: PairToEvaluate[] = [];
  const shuffledIds = shuffleArray(uniqueImageIds);
  const usageCount = Object.fromEntries(shuffledIds.map((id) => [id, 0]));
  const blockedPairIds = new Set(excludedPairIds);
  let attempts = 0;
  const maxAttempts = shuffledIds.length * shuffledIds.length;

  while (pairs.length < batchSize && attempts < maxAttempts) {
    attempts += 1;

    const sortedByUsage = Object.entries(usageCount).sort(
      (a, b) => a[1] - b[1],
    );
    const [imageId1] = sortedByUsage[0] ?? [];

    if (!imageId1) {
      break;
    }

    for (let index = 1; index < sortedByUsage.length; index += 1) {
      const [imageId2] = sortedByUsage[index] ?? [];

      if (!imageId2 || imageId1 === imageId2) {
        continue;
      }

      const pairId = createPairId(imageId1, imageId2);
      if (blockedPairIds.has(pairId)) {
        continue;
      }

      const [sortedImageId1, sortedImageId2] = [imageId1, imageId2].sort();
      pairs.push({
        pairId,
        imageId1: sortedImageId1,
        imageId2: sortedImageId2,
      });

      usageCount[imageId1] += 1;
      usageCount[imageId2] += 1;
      blockedPairIds.add(pairId);
      break;
    }
  }

  return pairs;
}

/**
 * Retrieves today's Conexões state, restoring it from local storage when
 * it still matches today's entry and keeping only coherent pair data.
 *
 * @param data - Today's Conexões payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyConexoesEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameIdToLocalTodayKey(gameInfo.id),
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Builds the default `GameState` for a fresh Conexões day.
 *
 * @param data - Today's Conexões payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyConexoesEntry): GameState {
  const pairs = generatePairs(data.imageIds, new Set());

  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    progress: 0,
    score: 0,
    pairs,
    currentPairIndex: 0,
    relatedPairs: [],
    generatedPairIds: pairs.map((pair) => pair.pairId),
    evaluatedCount: 0,
  };
}

/**
 * Determines whether a restored Conexões state still matches today's data
 * and keeps a coherent generated-pair queue.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Conexões payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyConexoesEntry): boolean {
  const availableImageIds = new Set(data.imageIds);
  const generatedPairIds = new Set(state.generatedPairIds);
  const validStatuses = new Set(Object.values(GAME_LIFECYCLE_STATUS));

  return (
    validStatuses.has(state.status) &&
    state.currentPairIndex === state.evaluatedCount &&
    state.currentPairIndex >= 0 &&
    state.currentPairIndex <= state.pairs.length &&
    state.evaluatedCount >= 0 &&
    state.relatedPairs.length <= state.evaluatedCount &&
    state.generatedPairIds.length === generatedPairIds.size &&
    state.pairs.every((pair) => isPairValid(pair, availableImageIds)) &&
    state.pairs.every((pair) => generatedPairIds.has(pair.pairId)) &&
    state.relatedPairs.every((pair) =>
      isPairValid(
        { ...pair, pairId: createPairId(pair.imageId1, pair.imageId2) },
        availableImageIds,
      ),
    )
  );
}

/**
 * Validates that a pair references existing images and keeps its canonical
 * sorted identifier.
 *
 * @param pair - Pair to validate.
 * @param availableImageIds - All valid image ids for today's entry.
 * @returns Whether the pair is coherent.
 */
function isPairValid(
  pair: PairToEvaluate,
  availableImageIds: Set<string>,
): boolean {
  return (
    pair.imageId1 !== pair.imageId2 &&
    availableImageIds.has(pair.imageId1) &&
    availableImageIds.has(pair.imageId2) &&
    pair.pairId === createPairId(pair.imageId1, pair.imageId2)
  );
}

/**
 * Returns a shuffled copy of a string list without mutating the original.
 *
 * @param values - Source values to shuffle.
 * @returns A shuffled copy.
 */
function shuffleArray(values: string[]): string[] {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}
