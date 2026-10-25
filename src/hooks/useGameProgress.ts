import { gameInfos } from '@engines';
import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { isFutureRelease, isRecentRelease } from '@utils/helpers';
import { orderBy } from 'lodash';
import { useMemo } from 'react';
import type {
  DateKey,
  DefaultGameState,
  GameInfo,
  PlaceholderGameData,
} from 'types/puzzles';

/**
 * How many days after its `releaseDate` a `'stable'` game still gets
 * auto-labeled `'beta'` on the hub, to flag it as recently released.
 */
const RECENT_STABLE_RELEASE_WINDOW_DAYS = 15;

/**
 * Union of valid game ids, derived from the registered game engines.
 */
type GameId = keyof typeof gameInfos;

/**
 * All registered `gameInfos` ids whose `type` is `'game'`, used to build
 * hub entries for the main games grid regardless of whether today's
 * response actually included their challenge.
 */
const GAME_IDS = (Object.keys(gameInfos) as GameId[]).filter(
  (id) => gameInfos[id].type === 'game',
);

/**
 * All registered `gameInfos` ids whose `type` is `'contribution'`, used to
 * build hub entries for the "Contribua" section.
 */
const CONTRIBUTION_IDS = (Object.keys(gameInfos) as GameId[]).filter(
  (id) => gameInfos[id].type === 'contribution',
);

/**
 * Card display states, in the exact priority order they should appear on
 * the hub (lower rank sorts first): ongoing games, then not-yet-started
 * ones, then games the player already made enough progress in to be
 * share-eligible, then finished ones, then locked/unavailable ones.
 */
export const CARD_STATE_ORDER = {
  'in-progress': 0,
  available: 1,
  tried: 2,
  completed: 3,
  disabled: 4,
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
 *   `'completed'` for a finished game (won or lost), `'tried'` for a game
 *   still in progress but already share-eligible, `'in-progress'` while
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
  if (status === GAME_LIFECYCLE_STATUS.TRIED) {
    return 'tried';
  }
  if (status === GAME_LIFECYCLE_STATUS.IN_PROGRESS) {
    return 'in-progress';
  }
  return 'available';
}

/**
 * Resolves the `GameInfo['release']` stage a game should actually be
 * displayed with on the hub, reconciling its static `info.release` with
 * whether today's `dailyEngine` response actually included its challenge:
 *
 * - A game whose `releaseDate` is still in the future is never shown,
 *   unless its stage is `'demo'`.
 * - `'unreleased'` and `'retired'` games are never shown.
 * - `'stable'` games missing from today's response are auto-labeled
 *   `'maintenance'` (shown, disabled); `'stable'` games present but
 *   released within {@link RECENT_STABLE_RELEASE_WINDOW_DAYS} days are
 *   auto-labeled `'beta'`.
 * - `'demo'`/`'beta'` games missing from today's response aren't shown at
 *   all (they only exist once the server actually serves their puzzle).
 * - Every other stage (`'disabled'`, `'maintenance'`, `'soon'`, or a
 *   present `'demo'`/`'beta'`) is shown as-is.
 *
 * @param info - The game's static metadata.
 * @param isPresent - Whether today's response included this game's
 *   challenge.
 * @returns The release stage to display the card with, or `null` if the
 *   game shouldn't be shown at all.
 */
export function resolveDisplayRelease(
  info: GameInfo,
  isPresent: boolean,
): GameInfo['release'] | null {
  if (info.release !== 'demo' && isFutureRelease(info.releaseDate)) {
    return null;
  }

  if (info.release === 'unreleased' || info.release === 'retired') {
    return null;
  }

  if (info.release === 'stable') {
    if (!isPresent) {
      return 'maintenance';
    }
    return isRecentRelease(info.releaseDate, RECENT_STABLE_RELEASE_WINDOW_DAYS)
      ? 'beta'
      : 'stable';
  }

  if ((info.release === 'demo' || info.release === 'beta') && !isPresent) {
    return null;
  }

  return info.release;
}

/**
 * Builds today's real per-entry progress for every registered game of the
 * given ids, joining each one's daily challenge (when present) with its
 * locally-persisted lifecycle state. Games that shouldn't be displayed
 * (see {@link resolveDisplayRelease}) are omitted entirely.
 *
 * @param dailyId - Today's date id, used to key locally-persisted state
 *   for games missing from `challenges`.
 * @param gameIds - The registered `gameInfos` ids to build entries for.
 * @param challenges - Today's challenge payloads, keyed by game id.
 * @returns Every displayable entry's progress.
 */
function buildProgressEntries(
  dailyId: DateKey | undefined,
  gameIds: GameId[],
  challenges: Record<string, PlaceholderGameData> | undefined,
): GameProgressEntry[] {
  const entries: GameProgressEntry[] = [];

  for (const key of gameIds) {
    const info = gameInfos[key];
    const challenge = challenges?.[key];
    const displayRelease = resolveDisplayRelease(info, Boolean(challenge));

    if (displayRelease === null) {
      continue;
    }

    const effectiveInfo: GameInfo =
      displayRelease === info.release
        ? info
        : { ...info, release: displayRelease };
    const resolvedChallenge: PlaceholderGameData = challenge ?? {
      id: dailyId ?? '',
      number: 0,
      type: key,
    };

    const localState = loadLocalToday<DefaultGameState>({
      key: info.key,
      dateId: resolvedChallenge.id,
      defaultValue: {
        id: resolvedChallenge.id,
        status: GAME_LIFECYCLE_STATUS.IDLE,
        progress: 0,
        score: 0,
      },
    });

    entries.push({
      key,
      challenge: resolvedChallenge,
      info: effectiveInfo,
      state: getCardState(effectiveInfo.release, localState.status),
      progressPercent: Math.round(localState.progress * 100),
    });
  }

  return entries;
}

/**
 * Builds today's real per-game progress by joining each daily challenge
 * with its locally-persisted lifecycle state, used as the single source of
 * truth for both the hub's progress summary and its game cards (before
 * they get sorted).
 *
 * @returns Today's game progress entries (see {@link resolveDisplayRelease}
 *   for which games are shown at all), plus how many are completed out of
 *   the total count of games currently playable (not `'maintenance'`,
 *   `'disabled'`, or `'soon'`).
 */
export function useGameProgress(): {
  entries: GameProgressEntry[];
  completedCount: number;
  totalCount: number;
} {
  const { data } = useGetDailyChallenges();

  return useMemo(() => {
    const entries = buildProgressEntries(data?.id, GAME_IDS, data?.challenges);

    // Only games currently playable (i.e. not in a non-playable release
    // stage) count toward the hub's "X of Y completed" progress summary;
    // disabled/soon/maintenance cards still render, but are excluded here
    // since the player can't actually complete them.
    const countableEntries = entries.filter(
      (entry) =>
        entry.info.release !== 'maintenance' &&
        entry.info.release !== 'disabled' &&
        entry.info.release !== 'soon',
    );

    const completedCount = countableEntries.filter(
      (entry) => entry.state === 'completed',
    ).length;

    return { entries, completedCount, totalCount: countableEntries.length };
  }, [data?.id, data?.challenges]);
}

/**
 * Builds today's progress entries for the hub's "Contribua" section
 * (currently Picaço and Tá Na Cara), joined with their locally-persisted
 * lifecycle state the same way {@link useGameProgress} does for regular
 * games.
 *
 * @returns Today's contribution game progress entries, in a fixed display
 *   order.
 */
export function useContributionProgress(): {
  entries: GameProgressEntry[];
} {
  const { data } = useGetDailyChallenges();

  return useMemo(() => {
    const entries = buildProgressEntries(
      data?.id,
      CONTRIBUTION_IDS,
      data?.contributions,
    );

    const orderedEntries = orderBy(entries, ['info.name.pt'], ['asc']);

    return { entries: orderedEntries };
  }, [data?.id, data?.contributions]);
}
