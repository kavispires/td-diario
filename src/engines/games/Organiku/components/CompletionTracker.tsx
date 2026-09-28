import { DailyItem } from '@components/games/DailyItem';
import { Badge } from '@components/ui/Badge';
import { cn } from '@utils/cn';
import type { useOrganikuEngine } from '../utils/useOrganikuEngine';

/**
 * Props accepted by the {@link CompletionTracker} component.
 */
type CompletionTrackerProps = {
  /**
   * Ids of the distinct items placed in the grid.
   */
  itemsIds: string[];
  /**
   * Per-item completion tracking.
   */
  tracker: ReturnType<typeof useOrganikuEngine>['tracker'];
  /**
   * Pixel width applied to each grid tile, used to scale the tracker icons.
   */
  itemWidth: number;
};

/**
 * Renders a row of the grid's distinct items, each badged with its
 * remaining tile count (or a checkmark once fully found).
 *
 * @param props Item ids, completion tracker, and sizing.
 * @returns The rendered completion tracker row.
 */
export function CompletionTracker({
  itemsIds,
  tracker,
  itemWidth,
}: CompletionTrackerProps) {
  return (
    <div className="my-5 flex items-center justify-center gap-3">
      {itemsIds.map((itemId) => {
        const isCompleted = tracker.completedItems[itemId];
        const count = tracker.remainingCounts[itemId];

        return (
          <Badge
            key={itemId}
            count={isCompleted ? '✓' : count}
            color={isCompleted ? 'var(--color-gold)' : 'var(--color-secondary)'}
          >
            <div
              className={cn(
                'rounded-xl',
                isCompleted ? 'bg-gold-soft' : 'bg-secondary-soft',
              )}
            >
              <DailyItem
                itemId={itemId}
                width={itemWidth * 0.75}
                className={isCompleted ? 'opacity-100' : 'opacity-80'}
              />
            </div>
          </Badge>
        );
      })}
    </div>
  );
}
