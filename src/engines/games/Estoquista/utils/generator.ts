import { deterministicShuffle, seedById } from '@utils/deterministicShuffle';
import type { DailyEstoquistaEntry } from 'types/games';

const TOTAL_GOODS = 256;
const GOODS_SIZE = 16;
const ORDER_SIZE = 4;
const OUT_OF_STOCK_SIZE = 1;

/**
 * Generates a purely deterministic DailyEstoquistaEntry based on the date.
 * Calling this with "2026-06-30" will always yield the exact same puzzle setup.
 *
 * @param id - The id of the entry in the format "YYYY-MM-DD".
 * @returns The generated DailyEstoquistaEntry object.
 */
export const generateDailyEstoquistaEntry = (
  id: string,
  puzzleNumber?: number,
): DailyEstoquistaEntry => {
  // 1. Initialize the predictable random generator from the daily id
  const seededRandom = seedById(id);

  const [year, month, day] = id.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeekIndex = date.getDay();

  const dayOfTheWeek = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ][dayOfWeekIndex];

  const entry: DailyEstoquistaEntry = {
    id,
    number: puzzleNumber ?? day, // Using the day of the month for the 'number' as requested
    type: 'estoquista',
    title: dayOfTheWeek,
    goods: [],
    orders: [],
  };

  // 3. Build the full array of possible goods
  const allGoods = Array.from(
    { length: TOTAL_GOODS },
    (_, i) => `good-${i + 1}`,
  );

  // 4. Deterministically shuffle the massive pool and slice what we need
  const shuffledGoods = deterministicShuffle(allGoods, seededRandom);
  const selectedItems = shuffledGoods.slice(0, GOODS_SIZE + OUT_OF_STOCK_SIZE);

  // 5. Separate the out of stock good
  const outOfStockGood = selectedItems.pop();
  if (!outOfStockGood) {
    throw new Error('No out of stock good');
  }

  // Assign the remaining 16 goods to the entry
  entry.goods = selectedItems;

  // 6. Deterministically pick the orders from the selected goods
  // We shuffle the selected 16 to pick 4 random (but predictable) ones
  const shuffledSelectedGoods = deterministicShuffle(entry.goods, seededRandom);
  const baseOrders = shuffledSelectedGoods.slice(0, ORDER_SIZE);

  // 7. Add the impossible out-of-stock item and shuffle the orders list one last time
  baseOrders.push(outOfStockGood);
  entry.orders = deterministicShuffle(baseOrders, seededRandom);

  return entry;
};
