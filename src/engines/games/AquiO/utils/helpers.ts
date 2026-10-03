import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { pluralize } from '@utils/helpers';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyAquiOEntry } from 'types/games';
import { gameInfo } from '../info';
import type { AquiODisc, AquiOItem, GameState } from './types';

export const GOAL = 15;
export const HEARTS = 3;
export const ROUND_DURATION_SECONDS = 60;

const DISC_POSITIONS = Array.from({ length: 9 }, (_, index) => index);
const DISC_SIZES = [100, 90, 110, 80, 105, 130, 120, 150, 115] as const;
const Z_INDEX_BY_SIZE: Record<number, number> = {
  80: 7,
  90: 6,
  100: 5,
  105: 4,
  110: 3,
  115: 0,
  120: 2,
  130: 1,
  150: 0,
};

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

function getItemNumericId(itemId: string): number {
  const match = itemId.match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

function getDefaultState(data: DailyAquiOEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: HEARTS,
    goal: GOAL,
    attempts: 0,
    maxProgress: 0,
    hardMode: false,
    progress: 0,
    score: 0,
  };
}

function buildDiscItem(
  itemId: string,
  position: number,
  size: number,
): AquiOItem {
  return {
    itemId,
    position,
    size,
    rotation: randomInt(361),
    zIndex: Z_INDEX_BY_SIZE[size] ?? 0,
  };
}

function createDisc(
  list: string[],
  previousDisc?: AquiODisc,
  previousMatchId?: string,
  nineSpots = false,
): AquiODisc {
  const randomPositions = shuffle(DISC_POSITIONS);
  const randomSizes = shuffle(DISC_SIZES);

  if (!previousDisc) {
    const initialItems = shuffle(list)
      .slice(0, nineSpots ? 9 : 8)
      .map((itemId, index) =>
        buildDiscItem(
          itemId,
          randomPositions[index] ?? 0,
          randomSizes[index] ?? 100,
        ),
      );

    return {
      id: [...initialItems]
        .sort((left, right) => {
          return getItemNumericId(left.itemId) - getItemNumericId(right.itemId);
        })
        .map((item) => item.itemId)
        .join(':'),
      items: initialItems,
    };
  }

  const previousItemIds = previousDisc.items.map((item) => item.itemId);
  const newCardItems = shuffle(
    list.filter((itemId) => !previousItemIds.includes(itemId)),
  ).slice(0, nineSpots ? 8 : 7);
  const matchingCandidates = previousItemIds.filter(
    (itemId) => itemId !== previousMatchId,
  );
  const matchingItem =
    matchingCandidates[randomInt(matchingCandidates.length)] ??
    previousItemIds[0] ??
    list[0];
  const items = shuffle([...newCardItems, matchingItem]).map((itemId, index) =>
    buildDiscItem(
      itemId,
      randomPositions[index] ?? 0,
      randomSizes[index] ?? 100,
    ),
  );

  return {
    id: [...items]
      .sort((left, right) => {
        return getItemNumericId(left.itemId) - getItemNumericId(right.itemId);
      })
      .map((item) => item.itemId)
      .join(':'),
    items,
    match: matchingItem,
  };
}

/**
 * Retrieves today's Aqui O state, restoring it from local storage when it
 * matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data - Today's Aqui O challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyAquiOEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Returns whether the given daily challenge falls on a weekend, which adds
 * one extra item to each Aqui O disc.
 *
 * @param dateId - Daily challenge id in `YYYY-MM-DD` format.
 * @returns `true` for Saturday/Sunday challenges.
 */
export function isWeekendChallenge(dateId: string): boolean {
  const dayOfWeek = new Date(`${dateId}T12:00:00`).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

/**
 * Generates the full sequence of discs for one Aqui O attempt, keeping only
 * one shared item between consecutive discs and optionally preventing the
 * same answer from repeating twice in a row.
 *
 * @param entry - Today's Aqui O payload.
 * @param challengingGame - Whether challenge mode is enabled.
 * @param weekendGame - Whether the round should use 9-item discs.
 * @returns The ordered disc sequence for the round.
 */
export function getDiscs(
  entry: DailyAquiOEntry,
  challengingGame = false,
  weekendGame = isWeekendChallenge(entry.id),
): AquiODisc[] {
  const allItems = shuffle(entry.itemsIds);
  const discs: AquiODisc[] = [];

  for (let index = 0; index < 17; index += 1) {
    const previousDisc = discs[index - 1];
    const disc = createDisc(
      allItems,
      previousDisc,
      challengingGame ? previousDisc?.match : undefined,
      weekendGame,
    );
    discs.push(disc);
  }

  return discs;
}

/**
 * Builds the plain-text shareable result for today's Aqui O run, matching
 * the original title/mode line and best-progress summary.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
  title,
  progress,
  bestProgress,
  goal,
  hardMode,
  attempts,
}: {
  challengeNumber: number;
  hearts: number;
  title: string;
  progress: number;
  bestProgress: number;
  goal: number;
  hardMode: boolean;
  attempts: number;
}): string {
  const usedProgress = Math.max(progress, bestProgress);

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: HEARTS,
    remainingHearts: hearts,
    additionalLines: [
      `${title}${hardMode ? '*' : ''}`,
      `${usedProgress}/${goal} discos (${attempts} ${pluralize(attempts, 'tentativa')})`,
    ],
  });
}
