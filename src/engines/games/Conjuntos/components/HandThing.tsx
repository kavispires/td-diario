import { useDraggable } from '@dnd-kit/core';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { DailyConjuntosThing } from 'types/games';
import { ThingCard } from './ThingCard';

/**
 * Props accepted by the {@link HandThing} component.
 */
type HandThingProps = {
  /**
   * Hand thing rendered by this card.
   */
  thing: DailyConjuntosThing;
  /**
   * Whether this thing is the currently tap-selected one.
   */
  isActive: boolean;
  /**
   * Pixel width applied to the thing's icon/name card.
   */
  width: number;
  /**
   * Called when the player taps the card instead of dragging it.
   */
  onSelect: () => void;
  /**
   * Whether the card should be fully non-interactive.
   */
  disabled?: boolean;
};

/**
 * Renders a single draggable hand card for Conjuntos. Supports both the
 * original tap-to-select flow and dragging the card directly onto a
 * diagram area.
 *
 * @param props - Thing data, selection state, sizing, and handlers.
 * @returns The rendered hand card.
 */
export function HandThing({
  thing,
  isActive,
  width,
  onSelect,
  disabled = false,
}: HandThingProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `conjuntos-drag-${thing.id}`,
      data: { thing },
      disabled,
    });

  return (
    <motion.button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      animate={{
        x: transform ? transform.x : 0,
        y: transform ? transform.y : 0,
        scale: isDragging ? 1.1 : 1,
        opacity: isDragging ? 0.95 : 1,
      }}
      transition={
        isDragging ? { type: 'tween', duration: 0 } : { duration: 0.15 }
      }
      className={cn(
        'rounded-2xl border-2 p-2 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isActive
          ? 'border-secondary bg-secondary-soft'
          : 'border-transparent bg-surface-raised hover:border-border-strong',
        !disabled && 'cursor-grab active:cursor-grabbing',
      )}
      style={{ zIndex: isDragging ? 10 : undefined, touchAction: 'none' }}
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={isActive}
      aria-label={`Selecionar ${thing.name}`}
    >
      <ThingCard
        itemId={thing.id}
        name={thing.name}
        width={width}
      />
    </motion.button>
  );
}
