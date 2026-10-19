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
 * user has played, sorted alphabetically by name, each showing the
 * game's logo, name, times played, and win rate.
 *
 * @param props Every played game's stats (sort order doesn't matter; this
 * component alphabetizes them for display).
 * @returns The rendered per-game stats list.
 */
export function GameStatsList({ perGameStats }: GameStatsListProps) {
  const alphabetizedStats = alphabetizeByGameName(perGameStats);

  return (
    <section className="flex flex-col gap-3">
      <Title
        level={4}
        className="mb-0"
      >
        Estatísticas por Jogo
      </Title>

      <div className="flex flex-col gap-2">
        {alphabetizedStats.map((stat) => (
          <GameStatsRow
            key={stat.gameKey}
            stat={stat}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Sorts a list of per-game stats alphabetically (pt-BR) by each game's
 * Portuguese name, falling back to its raw `gameKey` when the game can't
 * be resolved via `findByGameKey`.
 *
 * @param perGameStats - Per-game stats, in any order.
 * @returns A new array sorted alphabetically by game name.
 */
function alphabetizeByGameName(
  perGameStats: ProfileGameStat[],
): ProfileGameStat[] {
  return [...perGameStats].sort((a, b) => {
    const nameA = findByGameKey(a.gameKey)?.name.pt ?? a.gameKey;
    const nameB = findByGameKey(b.gameKey)?.name.pt ?? b.gameKey;
    return nameA.localeCompare(nameB, 'pt-BR');
  });
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
