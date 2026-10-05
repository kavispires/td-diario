import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import type { DailyIdeiasEntry } from 'types/games';
import { gameInfo } from '../info';
import type { GameState } from './types';

/**
 * Builds the default `GameState` for a fresh Ideias day.
 *
 * @param data - Today's Ideias payload.
 * @returns A fresh `GameState`.
 */
function getDefaultState(data: DailyIdeiasEntry): GameState {
  return {
    id: data.id,
    status: GAME_LIFECYCLE_STATUS.IDLE,
    progress: 0,
    score: 0,
    lastCategory: null,
    submissionCount: 0,
  };
}

/**
 * Retrieves today's Ideias state, restoring it from local storage when it
 * still matches today's entry, or rebuilding a fresh state otherwise.
 *
 * @param data - Today's Ideias payload.
 * @returns The initial `GameState` to seed the engine with.
 */
export function getInitialState(data: DailyIdeiasEntry): GameState {
  const defaultState = getDefaultState(data);
  return loadLocalToday<GameState>({
    key: gameInfo.key,
    dateId: data.id,
    defaultValue: defaultState,
  });
}
