import { DailyItem } from '@components/games/DailyItem';
import { cn } from '@utils/cn';
import { countThing } from '../utils/helpers';

/**
 * Props accepted by the {@link ThingCard} component.
 */
type ThingCardProps = {
  /**
   * Sprite id rendered for the thing.
   */
  itemId: string;
  /**
   * Word shown under the sprite.
   */
  name: string;
  /**
   * Base width, in pixels, used to size the sprite.
   */
  width?: number;
  /**
   * Additional classes merged with the card's own classes.
   */
  className?: string;
  /**
   * Whether to collapse the sprite and show only the label.
   */
  minimize?: boolean;
  /**
   * Whether the card should visually emphasize the label.
   */
  emphasize?: boolean;
};

/**
 * Renders one Conjuntos thing: its sprite plus the word the player uses to
 * infer the hidden grammar rules.
 *
 * @param props Sprite id, label, sizing, and display options.
 * @returns The rendered thing card.
 */
export function ThingCard({
  itemId,
  name,
  width = 64,
  className,
  minimize = false,
  emphasize = false,
}: ThingCardProps) {
  const boundedWidth = Math.max(Math.min(width, 100), 35);

  return (
    <div
      className={cn('flex min-w-0 flex-col items-center gap-1', className)}
      title={countThing(name)}
    >
      {!minimize && (
        <DailyItem
          itemId={itemId}
          width={boundedWidth}
          padding={0}
        />
      )}

      <span
        className={cn(
          'text-center font-semibold text-foreground',
          emphasize ? 'text-base' : 'text-sm',
        )}
      >
        {name}
      </span>
    </div>
  );
}
