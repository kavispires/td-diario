import { useDroppable } from '@dnd-kit/core';
import { cn } from '@utils/cn';

/**
 * Props accepted by the {@link TimelineGap} component.
 */
type TimelineGapProps = {
  /**
   * This gap's insertion index: dropping a card here moves it to become
   * the item at this position (0 = before the first event, `events.length`
   * = after the last one).
   */
  index: number;
  /**
   * Whether the game has ended (win or lose), disabling interaction.
   */
  isComplete: boolean;
};

/**
 * Renders a thin droppable strip between (or around) Épocas' event cards.
 * Dropping a dragged card here moves it to this exact position, shifting
 * the events in between, instead of swapping it with whatever card it
 * lands on.
 *
 * @param props This gap's insertion index and the game's completion state.
 * @returns The rendered drop strip.
 */
export function TimelineGap({ index, isComplete }: TimelineGapProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `epocas-gap-${index}`,
    data: { type: 'gap', index },
    disabled: isComplete,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-5 w-full rounded-full transition-colors',
        isOver && !isComplete && 'bg-primary/30',
      )}
      aria-hidden="true"
    />
  );
}
