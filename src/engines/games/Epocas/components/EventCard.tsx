import { Text } from '@components/ui/Typography';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';

/**
 * Props accepted by the {@link EventCard} component.
 */
type EventCardProps = {
  /**
   * The event's current position within the timeline (0-based).
   */
  position: number;
  /**
   * The event's description, shown without its secret year.
   */
  event: string;
  /**
   * Whether this card is currently selected for the tap-to-swap fallback.
   */
  isSelected: boolean;
  /**
   * Whether the game has ended (win or lose), disabling interaction.
   */
  isComplete: boolean;
  /**
   * Taps/selects this card, used by the tap-to-select-then-swap fallback.
   */
  onSelect: (position: number) => void;
};

/**
 * Renders one event card in Épocas' vertical timeline: a full-width row
 * with a position badge, draggable and droppable as an "aged paper" card
 * showing the event's text (never its year). Dropping another card
 * directly onto it swaps their positions (see {@link TimelineGap} for
 * inserting between cards instead); tapping offers the same swap as an
 * accessible fallback.
 *
 * @param props Position, event text, selection/completion state, and the
 *   tap handler.
 * @returns The rendered event card.
 */
export function EventCard({
  position,
  event,
  isSelected,
  isComplete,
  onSelect,
}: EventCardProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `epocas-slot-${position}`,
    data: { type: 'card', position },
    disabled: isComplete,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `epocas-drag-${position}`,
    data: { position },
    disabled: isComplete,
  });

  const isReceiving = isOver && !isDragging && !isComplete;

  return (
    <motion.div
      ref={setDroppableRef}
      layout
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="flex w-full items-center gap-3"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-xs font-semibold text-foreground">
        {position + 1}
      </div>

      <motion.button
        ref={setDraggableRef}
        type="button"
        {...listeners}
        {...attributes}
        onClick={() => onSelect(position)}
        disabled={isComplete}
        animate={{
          x: transform ? transform.x : 0,
          y: transform ? transform.y : 0,
          opacity: isDragging ? 0.85 : 1,
        }}
        transition={
          isDragging ? { type: 'tween', duration: 0 } : { duration: 0.35 }
        }
        className={cn(
          'flex w-full items-center rounded-lg border-2 border-transparent bg-[#f4e8d5] px-3 py-3 text-left shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50',
          !isComplete && 'cursor-grab hover:border-primary/40',
          isComplete && 'cursor-default',
          isSelected && 'border-primary bg-primary-soft',
          isReceiving && 'border-primary/50 bg-primary-soft',
        )}
        style={{
          touchAction: 'none',
          zIndex: isDragging ? 50 : 1,
        }}
        aria-label={`Evento na posição ${position + 1}: ${event}`}
        aria-pressed={isSelected}
      >
        <Text className="text-sm leading-snug">{event}</Text>
      </motion.button>
    </motion.div>
  );
}
