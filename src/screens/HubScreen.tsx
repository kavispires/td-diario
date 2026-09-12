import { DailyStatusBoard } from '@components/DailyStatusBoard';
import { GameCard } from '@components/hub/GameCard';
import { Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { orderBy, random, sample } from 'lodash';
import { LayoutGroup } from 'motion/react';

type GameId = keyof typeof gameInfos;

function isGameChallenge(value: unknown): value is { type: GameId } {
  if (!value || typeof value !== 'object' || !('type' in value)) {
    return false;
  }

  const type = value.type;
  return typeof type === 'string' && Object.keys(gameInfos).includes(type);
}

export function HubScreen() {
  const { data } = useGetDailyChallenges();

  // Ordered of cards (resolve ties by alphabetical order)
  // 1. Available and in progress and order by progress percentage
  // 2. Available yet to be started
  // 2a. New available games first
  // 2b. Other available games
  // 3. Completed
  // 4. Disabled

  // Order the challenge data. First separate contributions from daily games
  // Then sort the games by name, then sort by ongoing, undone and completed. (there is no logic for this yet)
  const orderedChallenges = orderBy(
    Object.values(data ?? {})
      .filter(isGameChallenge)
      .map((challenge) => {
        const progress = Math.random() < 0.2 ? random(15, 85) : 0;
        const state =
          progress === 0
            ? sample([
                'available',
                'available',
                'available',
                'available',
                'completed',
                'completed',
                'completed',
                'disabled',
              ])
            : 'in-progress';

        return {
          key: challenge.type,
          challenge: challenge,
          info: gameInfos[challenge.type],
          size: 'small',
          state: state,
          progressPercent: progress,
        };
      })
      .filter((entry) => entry.info.type === 'game'),
    [
      (o) => o.progressPercent,
      (o) => o.state === 'available',
      (o) => o.state === 'completed',
      'info.name.pt',
    ], // Order by the game's name
    ['desc', 'desc', 'desc', 'asc'], // Ascending order
  );

  return (
    <>
      <DailyStatusBoard />

      <Title className="p-1 text-center text-lg">Jogue</Title>

      <LayoutGroup>
        <div className="grid grid-cols-6 gap-3 mx-4">
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
