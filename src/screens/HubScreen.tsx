import { DailyStatusBoard } from '@components/DailyStatusBoard';
import { GameCard } from '@components/hub/GameCard';
import { Title } from '@components/ui/Typography';
import { CARD_STATE_ORDER, useGameProgress } from '@hooks/useGameProgress';
import { orderBy } from 'lodash';
import { LayoutGroup } from 'motion/react';

/**
 * Renders the hub screen: the daily status board and the grid of playable
 * game cards, ordered by progress and availability.
 *
 * @returns The hub screen element.
 */
export function HubScreen() {
  const { entries } = useGameProgress();

  // Order the cards:
  // 1. In-progress games, ordered by progress percentage (highest first)
  // 2. Available (not yet started) games
  // 3. Completed games
  // 4. Disabled/unavailable games
  // Ties within a group are resolved alphabetically by name.

  const orderedChallenges = orderBy(
    entries,
    [
      (o) => CARD_STATE_ORDER[o.state],
      (o) => o.progressPercent,
      (o) => o.info.release,
      'info.name.pt',
    ],
    ['asc', 'desc', 'asc', 'asc'],
  );

  return (
    // pb-24 keeps the last row of cards clear of the fixed bottom nav
    // (see ChromeNav, which pins itself only on this screen).
    <div className="flex flex-col pb-24">
      <DailyStatusBoard />

      <Title className="p-1 text-center text-lg">Jogue</Title>

      <LayoutGroup>
        <div className="grid grid-cols-6 gap-3">
          {orderedChallenges.map((entry, index) => (
            <GameCard
              key={entry.key}
              gameInfo={entry.info}
              size={index === 0 ? 'large' : index < 3 ? 'rectangle' : 'small'}
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
    </div>
  );
}
