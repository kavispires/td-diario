import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyQuartetosEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  QUARTETOS_SHARE_LEVEL_EMOJIS,
  QUARTETOS_SHARE_UNKNOWN_EMOJI,
} from './constants';
import type { GameState } from './types';

/**
 * Builds the default `GameState` for a fresh Quartetos day.
 *
 * Hearts start equal to the number of hidden quartets, matching the original
 * "four mistakes max" rule while still deriving from today's payload.
 *
 * @param data - Today's Quartetos challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyQuartetosEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: data.sets.length,
    guesses: [],
    matches: [],
    grid: [...data.grid],
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Quartetos state, restoring it from local storage when it
 * matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data - Today's Quartetos challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyQuartetosEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Normalizes a quartet's item ids into a stable comparison key so the same
 * combination matches regardless of the order in which the player tapped it.
 *
 * @param items - The four selected item ids.
 * @returns The normalized quartet key.
 */
export function buildSetKey(items: string[]): string {
  return [...items]
    .sort((left, right) => Number(left) - Number(right))
    .join('-');
}

/**
 * Returns a new array with the provided items shuffled in random order.
 *
 * @param items - Items to shuffle.
 * @returns A shuffled copy of `items`.
 */
export function shuffleItems<TItem>(items: TItem[]): TItem[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [
      nextItems[swapIndex],
      nextItems[index],
    ];
  }

  return nextItems;
}

/**
 * Builds the shareable result for today's Quartetos run: the
 * standard header/hearts lines plus one emoji row per submitted guess.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  hearts,
  guesses,
  sets,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  guesses: string[];
  sets: DailyQuartetosEntry['sets'];
  score: number;
}): ShareResult {
  const emojisMap = sets.reduce<Dictionary<string>>((accumulator, set) => {
    set.itemsIds.forEach((itemId) => {
      accumulator[itemId] =
        QUARTETOS_SHARE_LEVEL_EMOJIS[set.level] ??
        QUARTETOS_SHARE_UNKNOWN_EMOJI;
    });
    return accumulator;
  }, {});
  const additionalLines = guesses.map((guess) =>
    guess
      .split('-')
      .map((itemId) => emojisMap[itemId] ?? QUARTETOS_SHARE_UNKNOWN_EMOJI)
      .join(' '),
  );

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: sets.length,
    remainingHearts: hearts,
    heartsSuffix: `(${score}pts)`,
    heartsSpacing: ' ',
    additionalLines,
  });
}

/**
 * Recreates Quartetos' shareable result using only the persisted daily
 * challenge payload and stored game progress, without mounting the game
 * engine or triggering any UI side effects.
 *
 * @param data - Today's Quartetos challenge payload.
 * @param state - Persisted daily Quartetos progress restored from local storage.
 * @returns The assembled `{ title, text, url }` share result for the run.
 */
export function buildShareFromProgress(
  data: DailyQuartetosEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    hearts: state.hearts,
    guesses: state.guesses,
    sets: data.sets,
    score: state.score,
  });
}
