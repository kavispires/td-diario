import { GameLogos } from '@components/hub/GameLogos';
import { DualTranslate } from '@components/ui/DualTranslate';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { findByGameKey } from '@engines';
import type { ProfileGameStat } from '@utils/profileStats';

/**
 * Props accepted by the {@link GameStatsList} component.
 */
type GameStatsListProps = {
  /**
   * Every played game's stats, sorted by `timesPlayed` descending.
   */
  perGameStats: ProfileGameStat[];
};

/**
 * Renders the Profile screen's per-game stats list: one row per game the
 * user has played, sorted by times played, each showing the game's logo,
 * name, times played, and win rate.
 *
 * @param props Every played game's stats, sorted descending.
 * @returns The rendered per-game stats list.
 */
export function GameStatsList({ perGameStats }: GameStatsListProps) {
  return (
    <section className="flex flex-col gap-3">
      <Title
        level={4}
        className="mb-0"
      >
        Estatísticas por Jogo
      </Title>

      <div className="flex flex-col gap-2">
        {perGameStats.map((stat) => (
          <GameStatsRow
            key={stat.gameKey}
            stat={stat}
          />
        ))}
      </div>
    </section>
  );
}

type GameStatsRowProps = {
  stat: ProfileGameStat;
};

function GameStatsRow({ stat }: GameStatsRowProps) {
  const gameInfo = findByGameKey(stat.gameKey);

  return (
    <Surface className="flex items-center gap-3 bg-white p-3">
      <div className="h-10 w-10 shrink-0">
        {gameInfo && (
          <GameLogos
            gameId={gameInfo.id}
            className="h-full w-full"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Text
          strong
          className="truncate"
        >
          {gameInfo ? (
            <DualTranslate>{gameInfo.name}</DualTranslate>
          ) : (
            stat.gameKey
          )}
        </Text>
        <Text
          type="secondary"
          className="text-xs"
        >
          {stat.timesPlayed} {stat.timesPlayed === 1 ? 'partida' : 'partidas'} ·{' '}
          {stat.wins}V/{stat.losses}D
        </Text>
      </div>

      <Text
        strong
        className="shrink-0 text-right text-sm"
      >
        {stat.winRatePercent}%
      </Text>
    </Surface>
  );
}
