import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { generateShareableResult } from '@utils/shareResults';
import { differenceInCalendarDays } from 'date-fns';
import type { DailyEstoquistaEntry } from 'types/games';
import type { DateKey } from 'types/puzzles';
import { gameInfo } from '../info';
import {
  ESTOQUISTA_FINAL_SUBMISSION_PROGRESS_STEPS,
  ESTOQUISTA_GENERATED_TITLE,
  ESTOQUISTA_ITEM_ID_POOL,
  ESTOQUISTA_MINIMUM_HEARTS,
  ESTOQUISTA_OUT_OF_STOCK_ORDER_COUNT,
  ESTOQUISTA_PHASE,
  ESTOQUISTA_RULES_GOODS_COUNT,
  ESTOQUISTA_RULES_ORDERS_COUNT,
  OUT_OF_STOCK_SHELF_INDEX,
} from './constants';
import type { Fulfillment, GameState } from './types';

/**
 * Creates a deterministic pseudo-random number generator seeded from a
 * string, so the same `dateId` always produces the same sequence.
 *
 * @param seed - String to derive the generator's seed from (today's id).
 * @returns A function that returns the next pseudo-random value in `[0, 1)`
 *   on each call.
 */
function createSeededRandom(seed: string): () => number {
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  let state = hash || 1;
  return () => {
    state = (state * 1664525 + 1013904223) | 0;
    return (state >>> 0) / 4294967296;
  };
}

/**
 * Deterministically shuffles a list using the Fisher-Yates algorithm driven
 * by a seeded random generator.
 *
 * @param items - The list to shuffle.
 * @param random - A seeded `() => number` generator in `[0, 1)`.
 * @returns A new, shuffled array.
 */
function seededShuffle<T>(items: readonly T[], random: () => number): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

/**
 * Generates today's Estoquista payload locally. Estoquista never arrives in
 * the `dailyEngine` response, so its puzzle content (goods to stock and
 * orders to fulfill, including one deliberately out-of-stock order) is
 * synthesized on the client from a fixed pool of known-good item ids,
 * seeded by today's date so every player sees the same puzzle.
 *
 * @param id - Today's date key.
 * @returns A freshly generated `DailyEstoquistaEntry` for today.
 */
export function generateDailyEstoquistaEntry(
  id: DateKey,
): DailyEstoquistaEntry {
  const random = createSeededRandom(id);
  const shuffledPool = seededShuffle(ESTOQUISTA_ITEM_ID_POOL, random);

  const goods = shuffledPool.slice(0, ESTOQUISTA_RULES_GOODS_COUNT);
  const inStockOrders = seededShuffle(goods, random).slice(
    0,
    ESTOQUISTA_RULES_ORDERS_COUNT - ESTOQUISTA_OUT_OF_STOCK_ORDER_COUNT,
  );
  const outOfStockOrder = shuffledPool.find(
    (itemId) => !goods.includes(itemId),
  );
  const orders = seededShuffle(
    outOfStockOrder ? [...inStockOrders, outOfStockOrder] : inStockOrders,
    random,
  );

  const number =
    differenceInCalendarDays(new Date(id), new Date(gameInfo.releaseDate)) + 1;

  return {
    id,
    number,
    type: 'estoquista',
    title: ESTOQUISTA_GENERATED_TITLE,
    goods,
    orders,
  };
}

/**
 * Derives today's starting heart count from the puzzle shape: one heart for
 * each in-stock order that must be found.
 *
 * @param data - Today's Estoquista payload.
 * @returns The total number of hearts available for the day.
 */
export function getTotalHearts(data: DailyEstoquistaEntry): number {
  return Math.max(
    data.orders.length - ESTOQUISTA_OUT_OF_STOCK_ORDER_COUNT,
    ESTOQUISTA_MINIMUM_HEARTS,
  );
}

/**
 * Counts how many goods have already been placed on the warehouse shelves.
 *
 * @param warehouse - Current warehouse shelf contents.
 * @returns The number of non-empty shelves.
 */
export function getPlacedGoodsCount(warehouse: GameState['warehouse']): number {
  return warehouse.filter(Boolean).length;
}

/**
 * Calculates the number of progress checkpoints in one full Estoquista run:
 * stocking every good, assigning every order, and submitting the final
 * delivery.
 *
 * @param data - Today's Estoquista payload.
 * @returns The total count of progress steps.
 */
export function getTotalProgressSteps(data: DailyEstoquistaEntry): number {
  return (
    data.goods.length +
    data.orders.length +
    ESTOQUISTA_FINAL_SUBMISSION_PROGRESS_STEPS
  );
}

/**
 * Builds the default `GameState` for a fresh Estoquista day.
 *
 * @param data - Today's Estoquista payload.
 * @param extraAttempts - Number of consumed restarts to carry over.
 * @returns A fresh `GameState`.
 */
export function getDefaultState(
  data: DailyEstoquistaEntry,
  extraAttempts = 0,
): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: Math.max(getTotalHearts(data) - extraAttempts, 0),
    phase: ESTOQUISTA_PHASE.STOCKING,
    warehouse: Array.from({ length: data.goods.length }, () => null),
    fulfillments: [],
    lastPlacedGoodId: null,
    guesses: [],
    evaluations: [],
    extraAttempts,
    score: 0,
    progress: 0,
  };
}

/**
 * Validates whether a restored local state still matches today's payload and
 * forms a coherent warehouse/fulfillment progression.
 *
 * @param state - Restored local state to validate.
 * @param data - Today's Estoquista payload.
 * @returns Whether the restored state is safe to reuse.
 */
function isValidState(state: GameState, data: DailyEstoquistaEntry): boolean {
  const totalHearts = getTotalHearts(data);
  const warehouseGoods = state.warehouse.filter(
    (goodId): goodId is string => goodId !== null,
  );
  const validGoods = new Set(data.goods);
  const validOrders = new Set(data.orders);
  const orderCount = data.orders.length;
  const goodsCount = data.goods.length;
  const shelfAssignments = state.fulfillments
    .filter(
      (fulfillment) => fulfillment.shelfIndex !== OUT_OF_STOCK_SHELF_INDEX,
    )
    .map((fulfillment) => fulfillment.shelfIndex);
  const placedGoodsCount = getPlacedGoodsCount(state.warehouse);
  const phaseMatchesBoard =
    state.phase === ESTOQUISTA_PHASE.STOCKING
      ? placedGoodsCount < goodsCount
      : placedGoodsCount === goodsCount;

  return (
    phaseMatchesBoard &&
    state.extraAttempts >= 0 &&
    state.extraAttempts < totalHearts &&
    state.hearts >= 0 &&
    state.hearts <= totalHearts &&
    state.warehouse.length === goodsCount &&
    warehouseGoods.length === new Set(warehouseGoods).size &&
    warehouseGoods.every((goodId) => validGoods.has(goodId)) &&
    state.fulfillments.length <= orderCount &&
    state.fulfillments.length ===
      new Set(state.fulfillments.map((fulfillment) => fulfillment.order))
        .size &&
    shelfAssignments.length === new Set(shelfAssignments).size &&
    state.fulfillments.filter(
      (fulfillment) => fulfillment.shelfIndex === OUT_OF_STOCK_SHELF_INDEX,
    ).length <= 1 &&
    state.fulfillments.every(
      (fulfillment) =>
        validOrders.has(fulfillment.order) &&
        (fulfillment.shelfIndex === OUT_OF_STOCK_SHELF_INDEX ||
          (fulfillment.shelfIndex >= 0 && fulfillment.shelfIndex < goodsCount)),
    ) &&
    state.evaluations.every(
      (attempt) =>
        attempt.length === orderCount &&
        attempt.every((value) => typeof value === 'boolean'),
    )
  );
}

/**
 * Retrieves today's Estoquista state, restoring it from local storage when
 * it still matches today's payload, or rebuilding a fresh state otherwise.
 *
 * @param data - Today's Estoquista payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyEstoquistaEntry): GameState {
  const defaultState = getDefaultState(data);
  const restoredState = loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });

  return isValidState(restoredState, data) ? restoredState : defaultState;
}

/**
 * Builds the fresh game state used when the player restarts the stocking
 * phase after consuming one extra attempt.
 *
 * @param data - Today's Estoquista payload.
 * @param extraAttempts - Total restarts already consumed including the next one.
 * @returns A reset `GameState` for the same day.
 */
export function getResetState(
  data: DailyEstoquistaEntry,
  extraAttempts: number,
): GameState {
  return getDefaultState(data, extraAttempts);
}

/**
 * Produces a normalized string signature for one fulfillment layout so the
 * engine can reject exact repeat attempts even if the player clicked orders
 * in a different sequence.
 *
 * @param fulfillments - Assigned orders for the current attempt.
 * @returns A stable string representation of the assignment layout.
 */
export function getGuessString(fulfillments: Fulfillment[]): string {
  return [...fulfillments]
    .sort((left, right) => left.order.localeCompare(right.order))
    .map((fulfillment) => `${fulfillment.order}:${fulfillment.shelfIndex}`)
    .join(',');
}

/**
 * Validates one submitted warehouse attempt, returning a boolean per order
 * in the same order the player saw them.
 *
 * @param orders - Orders requested for today's challenge.
 * @param warehouse - Current warehouse shelf contents.
 * @param fulfillments - Player assignments for the current submission.
 * @returns One correctness flag per order.
 */
export function validateAttempts(
  orders: DailyEstoquistaEntry['orders'],
  warehouse: GameState['warehouse'],
  fulfillments: Fulfillment[],
): boolean[] {
  return orders.map((order) => {
    const fulfillment = fulfillments.find(
      (currentFulfillment) => currentFulfillment.order === order,
    );

    if (!fulfillment) {
      return false;
    }

    if (fulfillment.shelfIndex === OUT_OF_STOCK_SHELF_INDEX) {
      return !warehouse.includes(order);
    }

    return warehouse[fulfillment.shelfIndex] === order;
  });
}

/**
 * Builds the plain-text shareable result for today's Estoquista run,
 * reusing the original delivery/evaluation emoji rows.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
  totalHearts,
  evaluations,
}: {
  challengeNumber: number;
  hearts: number;
  totalHearts: number;
  evaluations: boolean[][];
}): string {
  const additionalLines = evaluations
    .map((attempt) => attempt.map((value) => (value ? '📫' : '🤬')).join(' '))
    .filter(Boolean);

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts,
    remainingHearts: hearts,
    additionalLines,
  });
}
