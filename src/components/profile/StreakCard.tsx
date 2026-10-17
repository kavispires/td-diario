import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import flameIcon from '../../assets/svg/flame.svg';

/**
 * Props accepted by the {@link StreakCard} component.
 */
type StreakCardProps = {
  /**
   * The user's current consecutive-day streak.
   */
  currentStreak: number;
  /**
   * The user's best (longest) streak ever reached.
   */
  longestStreak: number;
};

/**
 * Renders the current and best day-streak side by side, reusing the hub's
 * flame icon treatment (greyed out at zero).
 *
 * @param props The user's current and longest streaks.
 * @returns The rendered streak card.
 */
export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <Surface className="grid grid-cols-2 divide-x divide-border bg-white p-4">
      <StreakStat
        label="Sequência Atual"
        streak={currentStreak}
      />
      <StreakStat
        label="Melhor Sequência"
        streak={longestStreak}
      />
    </Surface>
  );
}

type StreakStatProps = {
  label: string;
  streak: number;
};

function StreakStat({ label, streak }: StreakStatProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 text-center">
      <div className="flex items-center gap-1.5">
        <img
          src={flameIcon}
          alt=""
          aria-hidden="true"
          className={cn('h-6 w-6', streak === 0 && 'grayscale opacity-50')}
        />
        <Text
          strong
          className="text-2xl"
        >
          {streak}
        </Text>
      </div>
      <Text
        type="secondary"
        className="text-xs"
      >
        {label}
      </Text>
    </div>
  );
}
