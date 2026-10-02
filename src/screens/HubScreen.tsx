import { DailyStatusBoard } from '@components/DailyStatusBoard';
import { GameCard } from '@components/hub/GameCard';
import { Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { orderBy } from 'lodash';
import { LayoutGroup } from 'motion/react';
import type { DefaultGameState, GameInfo } from 'types/puzzles';

/**
 * Union of valid game ids, derived from the registered game engines.
 */
type GameId = keyof typeof gameInfos;

/**
 * Card display states, in the exact priority order they should appear on
 * the hub (lower rank sorts first): ongoing games, then not-yet-started
 * ones, then finished ones, then locked/unavailable ones.
 */
const CARD_STATE_ORDER = {
  'in-progress': 0,
  available: 1,
  completed: 2,
  disabled: 3,
} as const;

/**
 * Derives the hub card's display `state` from a game's release stage and
 * its persisted lifecycle status.
 *
 * @param release - The game's `GameInfo['release']`.
 * @param status - The game's current `DefaultGameState['status']`.
 * @returns `'disabled'` when the game isn't available to play yet,
 *   `'completed'` for a finished game (won or lost), `'in-progress'` while
 *   it's ongoing, or `'available'` if it hasn't been started yet.
 */
function getCardState(
  release: GameInfo['release'],
  status: DefaultGameState['status'],
): keyof typeof CARD_STATE_ORDER {
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
 * Renders the hub screen: the daily status board and the grid of playable
 * game cards, ordered by progress and availability.
 *
 * @returns The hub screen element.
 */
export function HubScreen() {
  const { data } = useGetDailyChallenges();

  // Order the cards:
  // 1. In-progress games, ordered by progress percentage (highest first)
  // 2. Available (not yet started) games
  // 3. Completed games
  // 4. Disabled/unavailable games
  // Ties within a group are resolved alphabetically by name.

  const orderedChallenges = orderBy(
    Object.values(data?.challenges ?? {})
      .map((challenge) => {
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
        const state = getCardState(info.release, localState.status);

        return {
          key: challenge.type,
          challenge: challenge,
          info,
          size: 'small',
          state,
          progressPercent: Math.round(localState.progress * 100),
        };
      })
      .filter((entry) => entry.info.type === 'game'),
    [
      (o) => CARD_STATE_ORDER[o.state],
      (o) => o.progressPercent,
      'info.name.pt',
    ],
    ['asc', 'desc', 'asc'],
  );

  return (
    <>
      <DailyStatusBoard />

      <Title className="p-1 text-center text-lg">Jogue</Title>

      <LayoutGroup>
        <div className="grid grid-cols-6 gap-3">
          {orderedChallenges.map((entry, index) => (
            <GameCard
              key={entry.key}
              gameInfo={entry.info}
              size={
                index === 0 ? 'large' : index < 3 ? 'rectangle' : entry.size
              }
              state={entry.state}
              progressPercent={entry.progressPercent}
            />
          ))}
        </div>
      </LayoutGroup>

      {/* <Button
        onClick={() => signOut()}
        variant="primary"
      >
        Logout
      </Button>

      <Button
        onClick={() => signOut()}
        variant="secondary"
      >
        Logout
      </Button>

      <Button
        onClick={() => signOut()}
        variant="ghost"
      >
        Logout
      </Button> */}
    </>
  );
}
