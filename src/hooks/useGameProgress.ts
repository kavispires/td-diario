import { gameInfos } from '@engines';
import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { useMemo } from 'react';
import type {
  DefaultGameState,
  GameInfo,
  PlaceholderGameData,
} from 'types/puzzles';

/**
 * Union of valid game ids, derived from the registered game engines.
 */
type GameId = keyof typeof gameInfos;

/**
 * Card display states, in the exact priority order they should appear on
 * the hub (lower rank sorts first): ongoing games, then not-yet-started
 * ones, then finished ones, then locked/unavailable ones.
 */
export const CARD_STATE_ORDER = {
  'in-progress': 0,
  available: 1,
  completed: 2,
  disabled: 3,
} as const;

/**
 * A hub card's display state, derived from a game's release stage and its
 * persisted lifecycle status.
 */
export type CardState = keyof typeof CARD_STATE_ORDER;

/**
 * A single game's real, locally-persisted progress for today, joined with
 * its static metadata and today's challenge payload.
 */
export type GameProgressEntry = {
  /**
   * The game's id, matching its `gameInfos`/`GameInfo.id` key.
   */
  key: string;
  /**
   * Today's challenge payload for this game, as returned by the API.
   */
  challenge: PlaceholderGameData;
  /**
   * The game's static metadata (name, color, release stage, etc.).
   */
  info: GameInfo;
  /**
   * The card's current display state (e.g. `'completed'`, `'in-progress'`).
   */
  state: CardState;
  /**
   * Today's progress, as a rounded percentage (0-100).
   */
  progressPercent: number;
};

/**
 * Derives a hub card's display `state` from a game's release stage and its
 * persisted lifecycle status.
 *
 * @param release - The game's `GameInfo['release']`.
 * @param status - The game's current `DefaultGameState['status']`.
 * @returns `'disabled'` when the game isn't available to play yet,
 *   `'completed'` for a finished game (won or lost), `'in-progress'` while
 *   it's ongoing, or `'available'` if it hasn't been started yet.
 */
export function getCardState(
  release: GameInfo['release'],
  status: DefaultGameState['status'],
): CardState {
  if (
    release === 'disabled' ||
    release === 'soon' ||
    release === 'maintenance' ||
    release === 'unreleased'
  ) {
    return 'disabled';
  }
  if (
    status === GAME_LIFECYCLE_STATUS.WIN ||
    status === GAME_LIFECYCLE_STATUS.LOSE
  ) {
    return 'completed';
  }
  if (status === GAME_LIFECYCLE_STATUS.IN_PROGRESS) {
    return 'in-progress';
  }
  return 'available';
}

/**
 * Builds today's real per-game progress by joining each daily challenge
 * with its locally-persisted lifecycle state, used as the single source of
 * truth for both the hub's progress summary and its game cards (before
 * they get sorted).
 *
 * @returns Today's game progress entries, plus how many are completed out
 *   of the total count of games currently playable (`type: 'game'`, and
 *   not `'maintenance'`, `'disabled'`, `'soon'`, or `'unreleased'`).
 */
export function useGameProgress(): {
  entries: GameProgressEntry[];
  completedCount: number;
  totalCount: number;
} {
  const { data } = useGetDailyChallenges();

  return useMemo(() => {
    const entries = Object.values(data?.challenges ?? {})
      .map((challenge): GameProgressEntry => {
        const info = gameInfos[challenge.type as GameId];
        const localState = loadLocalToday<DefaultGameState>({
          key: info.key,
          dateId: challenge.id,
          defaultValue: {
            id: challenge.id,
            status: GAME_LIFECYCLE_STATUS.IDLE,
            progress: 0,
            score: 0,
          },
        });

        return {
          key: challenge.type,
          challenge,
          info,
          state: getCardState(info.release, localState.status),
          progressPercent: Math.round(localState.progress * 100),
        };
      })
      .filter(
        (entry) =>
          entry.info.type === 'game' && entry.info.release !== 'unreleased',
      );

    // Only games currently playable (i.e. not in a non-playable release
    // stage) count toward the hub's "X of Y completed" progress summary;
    // disabled/soon/maintenance/unreleased cards still render, but are
    // excluded here since the player can't actually complete them.
    const countableEntries = entries.filter(
      (entry) =>
        entry.info.release !== 'maintenance' &&
        entry.info.release !== 'disabled' &&
        entry.info.release !== 'soon' &&
        entry.info.release !== 'unreleased',
    );

    const completedCount = countableEntries.filter(
      (entry) => entry.state === 'completed',
    ).length;

    return { entries, completedCount, totalCount: countableEntries.length };
  }, [data?.challenges]);
}
