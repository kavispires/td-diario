import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import type { MilestoneStatus } from '@utils/milestones';

/**
 * Props accepted by the {@link MilestoneBadge} component.
 */
type MilestoneBadgeProps = {
  /**
   * The milestone and whether the current user has earned it.
   */
  milestone: MilestoneStatus;
};

/**
 * Renders a single milestone as a small badge: colored with its icon when
 * earned, greyed out and locked otherwise.
 *
 * @param props The milestone and its earned status.
 * @returns The rendered milestone badge.
 */
export function MilestoneBadge({ milestone }: MilestoneBadgeProps) {
  const { icon: Icon, title, description, earned } = milestone;

  return (
    <div
      className="flex flex-col items-center gap-1.5 text-center"
      title={description}
    >
      <div
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full',
          earned
            ? 'bg-gold-soft text-gold'
            : 'bg-black/5 text-muted-foreground',
        )}
      >
        <Icon
          className={cn('h-7 w-7', !earned && 'opacity-50')}
          strokeWidth={1.75}
        />
      </div>

      <Text
        type={earned ? 'default' : 'secondary'}
        strong={earned}
        className="text-xs leading-tight"
      >
        {title}
      </Text>
    </div>
  );
}
