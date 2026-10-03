import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { generateShareableResult } from '@utils/shareResults';
import type { DailyPanicoEntry } from 'types/games';
import { gameInfo } from '../info';
import { PANICO_TOTAL_HEARTS } from './constants';
import type { GameState } from './types';

/**
 * Returns a fresh Panico state for the current day.
 *
 * @param data Today's Panico payload.
 * @returns A new default state.
 */
function getDefaultState(data: DailyPanicoEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    hearts: PANICO_TOTAL_HEARTS,
    totalButtons: data.buttons.length,
    farthestButtonIndex: 0,
    score: 0,
    progress: 0,
  };
}

/**
 * Loads today's Panico state from local storage, resetting it if the saved
 * entry belongs to a different day or an older shape.
 *
 * @param data Today's Panico payload.
 * @returns The state used to seed the engine.
 */
export function getInitialState(data: DailyPanicoEntry): GameState {
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: getDefaultState(data),
  });
}

/**
 * Computes normalized progress for a given number of completed buttons.
 *
 * @param completedButtons Highest completed button count reached so far.
 * @param totalButtons Total sequence length for the day.
 * @returns A `0..1` completion ratio.
 */
export function getProgress(
  completedButtons: number,
  totalButtons: number,
): number {
  if (totalButtons <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, completedButtons / totalButtons));
}

/**
 * Converts progress into the percentage shown in Panico's results.
 *
 * @param completedButtons Highest completed button count reached so far.
 * @param totalButtons Total sequence length for the day.
 * @returns Rounded completion percentage.
 */
export function getCompletionPercentage(
  completedButtons: number,
  totalButtons: number,
): number {
  return Math.round(getProgress(completedButtons, totalButtons) * 100);
}

/**
 * Builds the plain-text shareable result for today's Panico run.
 *
 * @param options - Today's challenge number, remaining hearts, and progress.
 * @returns The assembled shareable result text.
 */
export function buildShareText({
  challengeNumber,
  hearts,
  percentage,
}: {
  challengeNumber: number;
  hearts: number;
  percentage: number;
}): string {
  return generateShareableResult({
    gameInfo,
    challengeNumber,
    totalHearts: PANICO_TOTAL_HEARTS,
    remainingHearts: hearts,
    heartsSuffix: `(${percentage}%)`,
  });
}
