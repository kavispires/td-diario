import { differenceInCalendarDays } from 'date-fns';
import type { DailyEstoquistaEntry } from 'types/games';
import type { DateKey } from 'types/puzzles';
import { gameInfo } from '../info';
import {
  ESTOQUISTA_GENERATED_TITLE,
  ESTOQUISTA_ITEM_ID_POOL,
  ESTOQUISTA_OUT_OF_STOCK_ORDER_COUNT,
  ESTOQUISTA_RULES_GOODS_COUNT,
  ESTOQUISTA_RULES_ORDERS_COUNT,
} from './constants';

/**
 * Creates a deterministic pseudo-random number generator seeded from a
 * string, so the same `dateId` always produces the same sequence.
 *
 * @param seed - String to derive the generator's seed from (today's id).
 * @returns A function that returns the next pseudo-random value in `[0, 1)`
 *   on each call.
 */
export function createSeededRandom(seed: string): () => number {
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
export function seededShuffle<T>(
  items: readonly T[],
  random: () => number,
): T[] {
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
