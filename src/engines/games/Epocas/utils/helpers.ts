import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { ShareResult } from '@utils/shareResults';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyEpocasEntry, DailyEpocasEvent } from 'types/games';
import { gameInfo } from '../info';
import { EPOCAS_TOTAL_HEARTS } from './constants';
import type { GameState } from './types';

/**
 * Builds the default `GameState` for a fresh Épocas day: the player starts
 * with the events in the shuffled (incorrect) order the backend sent.
 *
 * @param data - Today's Épocas challenge payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyEpocasEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: EPOCAS_TOTAL_HEARTS,
    order: data.events.map((_, index) => index),
    attempts: [],
    score: 0,
    progress: 0,
  };
}

/**
 * Retrieves today's Épocas state, restoring it from local storage when it
 * matches today's challenge id, or building a fresh state otherwise.
 *
 * @param data - Today's Épocas challenge payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyEpocasEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Builds the chronologically correct order of event indices, oldest year
 * first.
 *
 * @param events - Today's events, in their shuffled starting order.
 * @returns Event indices sorted by `year` ascending.
 */
export function getSortedIndexes(events: DailyEpocasEvent[]): number[] {
  return events
    .map((_, index) => index)
    .sort((left, right) => events[left].year - events[right].year);
}

/**
 * Counts how many positions in the player's current `order` already match
 * the chronologically correct order, used both to detect a win and to
 * report "X of N correct" feedback without revealing which ones are wrong.
 *
 * @param order - The player's current timeline, as event indices.
 * @param sortedIndexes - The chronologically correct event indices, as
 *   returned by {@link getSortedIndexes}.
 * @returns The number of positions where `order` matches `sortedIndexes`.
 */
export function countCorrectPositions(
  order: number[],
  sortedIndexes: number[],
): number {
  return order.reduce(
    (total, eventIndex, position) =>
      total + (eventIndex === sortedIndexes[position] ? 1 : 0),
    0,
  );
}

/**
 * Returns a new order array with the events at the two given positions
 * swapped.
 *
 * @param order - The current timeline order.
 * @param fromIndex - Position of the first event to swap.
 * @param toIndex - Position of the second event to swap.
 * @returns A new order array with both positions swapped.
 */
export function swapPositions(
  order: number[],
  fromIndex: number,
  toIndex: number,
): number[] {
  const nextOrder = [...order];
  [nextOrder[fromIndex], nextOrder[toIndex]] = [
    nextOrder[toIndex],
    nextOrder[fromIndex],
  ];
  return nextOrder;
}

/**
 * Returns a new order array with the event at `fromIndex` removed and
 * reinserted at the given gap, shifting every event in between instead of
 * swapping two positions. A gap index of `N` means "insert after the last
 * event"; dropping a card on a gap immediately touching its own current
 * position is a no-op.
 *
 * @param order - The current timeline order.
 * @param fromIndex - Position of the event being moved.
 * @param toGapIndex - Insertion gap index, from `0` to `order.length`.
 * @returns A new order array with the event moved, or the original array
 *   unchanged when the drop is a no-op.
 */
export function movePosition(
  order: number[],
  fromIndex: number,
  toGapIndex: number,
): number[] {
  if (toGapIndex === fromIndex || toGapIndex === fromIndex + 1) {
    return order;
  }

  const nextOrder = [...order];
  const [moved] = nextOrder.splice(fromIndex, 1);
  const insertAt = toGapIndex > fromIndex ? toGapIndex - 1 : toGapIndex;
  nextOrder.splice(insertAt, 0, moved);
  return nextOrder;
}

/**
 * Formats a historical year for display, rendering negative years as BC
 * ("a.C.") and non-negative years as the bare AD number, since AD is the
 * assumed default.
 *
 * @param year - The event's year; negative values represent BC/BCE years.
 * @returns The formatted year, e.g. `"44 a.C."` or `"1822"`.
 */
export function formatHistoricalYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} a.C.` : `${year}`;
}

/**
 * Builds the shareable result for today's Épocas run: the standard
 * header/hearts line plus one line per verify attempt, showing how many
 * events were correctly placed out of the total.
 *
 * @param options - Today's challenge number and final run state.
 * @returns The assembled `{ title, text, url }` share result.
 */
export function buildShare({
  challengeNumber,
  hearts,
  attempts,
  totalEvents,
  score,
}: {
  challengeNumber: number;
  hearts: number;
  attempts: number[];
  totalEvents: number;
  score: number;
}): ShareResult {
  const additionalLines = attempts.map(
    (correctCount) => `${correctCount}/${totalEvents} 🕰️`,
  );

  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: EPOCAS_TOTAL_HEARTS,
    remainingHearts: hearts,
    heartsSuffix: `(${score}pts)`,
    additionalLines,
  });
}

/**
 * Recreates Épocas' shareable result using only the persisted daily
 * challenge payload and stored game progress, without mounting the game
 * engine or triggering any UI side effects.
 *
 * @param data - Today's Épocas challenge payload.
 * @param state - Persisted daily Épocas progress restored from local storage.
 * @returns The assembled `{ title, text, url }` share result for the run.
 */
export function buildShareFromProgress(
  data: DailyEpocasEntry,
  state: GameState,
): ShareResult {
  return buildShare({
    challengeNumber: data.number,
    hearts: state.hearts,
    attempts: state.attempts,
    totalEvents: data.events.length,
    score: state.score,
  });
}
