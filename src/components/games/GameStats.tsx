import { Tooltip } from '@components/ui/Tooltip';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { ComponentType, ReactNode, SVGProps } from 'react';

/**
 * Duration, in seconds, of the {@link GameStatsRow} progress bar's fill
 * animation.
 */
const PROGRESS_BAR_TRANSITION_DURATION_SECONDS = 0.3;

/**
 * Props accepted by the {@link GameStat} component.
 */
type GameStatProps = {
  /**
   * Icon rendered before the value (usually a `lucide-react` icon).
   */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /**
   * Value shown next to the icon (e.g. a count, a fraction, or a dash
   * placeholder for a stat that isn't implemented yet).
   */
  value: ReactNode;
  /**
   * Tooltip label describing the stat, shown on hover/focus and used as
   * this stat's accessible name.
   */
  label: string;
  /**
   * Horizontal alignment of the icon/value within its column. Defaults to
   * `start`.
   */
  align?: 'start' | 'center' | 'end';
};

const ALIGN_CLASSES: Record<NonNullable<GameStatProps['align']>, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

/**
 * Renders a single labeled game stat (an icon plus a value) with a tooltip
 * naming it, e.g. a flip counter or a not-yet-implemented score. Meant to
 * sit inside a {@link GameStatsRow}.
 *
 * @param props Icon, value, tooltip label, and alignment.
 * @returns The rendered stat trigger.
 */
export function GameStat({
  icon: Icon,
  value,
  label,
  align = 'start',
}: GameStatProps) {
  return (
    <div className={cn('flex items-center', ALIGN_CLASSES[align])}>
      <Tooltip title={label}>
        <button
          type="button"
          aria-label={`${label}: ${value}`}
          className="flex cursor-default items-center gap-1"
        >
          <Icon
            className="h-4 w-4"
            aria-hidden="true"
          />
          <Text className="text-sm">{value}</Text>
        </button>
      </Tooltip>
    </div>
  );
}

/**
 * Props accepted by the {@link GameStatsRow} component.
 */
type GameStatsRowProps = {
  /**
   * The row's three columns (e.g. two {@link GameStat}s and a `Hearts`
   * indicator), laid out with equal width.
   */
  children: ReactNode;
  /**
   * Completion fraction from `0` to `1`, rendered as a thin animated bar
   * along the row's bottom edge in place of a plain border.
   */
  progress: number;
  /**
   * Fill color for the progress bar, typically the game's own theme color
   * (`gameInfo.color`).
   */
  color: string;
};

/**
 * Lays out a single-line, three-column row of game stats (e.g. flips,
 * hearts, and score) as a highlighted bar at the top of a game's content,
 * above its title. Renders a thin progress bar along its bottom edge
 * instead of a separate progress indicator elsewhere on the page.
 *
 * @param props The row's three columns, a completion fraction, and a
 * progress bar fill color.
 * @returns The rendered stats row.
 */
export function GameStatsRow({ children, progress, color }: GameStatsRowProps) {
  return (
    <div className="relative grid w-full grid-cols-3 items-center overflow-hidden rounded-2xl bg-border/60 px-4 py-2 shadow-sm">
      {children}

      <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${progress * 100}%` }}
          transition={{
            duration: PROGRESS_BAR_TRANSITION_DURATION_SECONDS,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}
