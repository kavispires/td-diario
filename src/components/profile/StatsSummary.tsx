import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import type { ProfileStats } from '@utils/profileStats';

/**
 * Props accepted by the {@link StatsSummary} component.
 */
type StatsSummaryProps = {
  /**
   * Derived aggregate stats, computed via `computeProfileStats`.
   */
  stats: ProfileStats;
  /**
   * Total number of games currently in the app's `gameInfos` registry,
   * used as the denominator for "distinct games played".
   */
  totalGameCount: number;
};

/**
 * Renders the overall stats summary: total games played, distinct games
 * played (out of the total available), and overall win rate.
 *
 * @param props Derived aggregate stats and the total game count.
 * @returns The rendered stats summary grid.
 */
export function StatsSummary({ stats, totalGameCount }: StatsSummaryProps) {
  return (
    <Surface className="grid grid-cols-3 gap-2 bg-white p-4">
      <StatCell
        value={stats.totalGamesPlayed}
        label="Partidas Jogadas"
      />
      <StatCell
        value={`${stats.distinctGamesPlayed}/${totalGameCount}`}
        label="Jogos Explorados"
      />
      <StatCell
        value={`${stats.winRatePercent}%`}
        label="Taxa de Vitória"
      />
    </Surface>
  );
}

type StatCellProps = {
  value: string | number;
  label: string;
};

function StatCell({ value, label }: StatCellProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <Text
        strong
        className="text-xl"
      >
        {value}
      </Text>
      <Text
        type="secondary"
        className="text-xs"
      >
        {label}
      </Text>
    </div>
  );
}
