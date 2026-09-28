import { Tooltip } from '@components/ui/Tooltip';
import { Text } from '@components/ui/Typography';
import type { ComponentType, ReactNode, SVGProps } from 'react';

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
    <div className={`flex items-center ${ALIGN_CLASSES[align]}`}>
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
};

/**
 * Lays out a single-line, three-column row of game stats (e.g. flips,
 * hearts, and score) under a game's title.
 *
 * @param props The row's three columns.
 * @returns The rendered stats row.
 */
export function GameStatsRow({ children }: GameStatsRowProps) {
  return <div className="grid w-full grid-cols-3 items-center">{children}</div>;
}
