import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { motion } from 'motion/react';
import { Fragment } from 'react';
import type { DailyEpocasEvent } from 'types/games';
import {
  EPOCAS_SHAKE_ANIMATION_DURATION_SECONDS,
  EPOCAS_SHAKE_KEYFRAMES,
} from '../utils/constants';
import { EventCard } from './EventCard';
import { TimelineGap } from './TimelineGap';

/**
 * Props accepted by the {@link Timeline} component.
 */
type TimelineProps = {
  /**
   * Today's events, in their shuffled (original) order.
   */
  events: DailyEpocasEvent[];
  /**
   * Current timeline order, as a permutation of indices into `events`.
   */
  order: number[];
  /**
   * Position currently selected for the tap-to-swap fallback, or `null`.
   */
  selectedIndex: number | null;
  /**
   * Timestamp of the latest failed verify attempt, used to replay a shake
   * animation.
   */
  latestAttempt: number;
  /**
   * Whether the game has ended (win or lose).
   */
  isComplete: boolean;
  /**
   * Swaps the events currently at the two given positions.
   */
  onSwap: (fromIndex: number, toIndex: number) => void;
  /**
   * Moves the event at `fromIndex` to the given insertion gap, shifting
   * the events in between instead of swapping two positions.
   */
  onMove: (fromIndex: number, toGapIndex: number) => void;
  /**
   * Tap-to-select-then-swap fallback handler.
   */
  onSelectForSwap: (position: number) => void;
};

/**
 * Renders Épocas' vertical timeline: a dotted path running down the left
 * edge behind a stacked column of draggable/droppable event cards,
 * interleaved with thin drop gaps. Dropping a card directly onto another
 * swaps their positions; dropping it onto a gap between cards instead
 * moves it there, shifting the events in between. Dragging is backed by a
 * tap-to-swap fallback for accessibility.
 *
 * @param props Today's events, the current order, selection/completion
 *   state, and the swap/move handlers.
 * @returns The rendered timeline.
 */
export function Timeline({
  events,
  order,
  selectedIndex,
  latestAttempt,
  isComplete,
  onSwap,
  onMove,
  onSelectForSwap,
}: TimelineProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const fromIndex = active.data.current?.position as number | undefined;

    if (fromIndex === undefined || !over) {
      return;
    }

    const overType = over.data.current?.type as 'card' | 'gap' | undefined;

    if (overType === 'card') {
      onSwap(fromIndex, over.data.current?.position as number);
    } else if (overType === 'gap') {
      onMove(fromIndex, over.data.current?.index as number);
    }
  }

  const shouldShake = latestAttempt > 0 && !isComplete;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        key={latestAttempt}
        className="relative w-full"
        initial={false}
        animate={{ x: shouldShake ? EPOCAS_SHAKE_KEYFRAMES : 0 }}
        transition={{
          duration: EPOCAS_SHAKE_ANIMATION_DURATION_SECONDS,
          ease: 'easeOut',
        }}
      >
        <div className="relative flex flex-col gap-1">
          <div
            className="pointer-events-none absolute top-3 bottom-3 left-3.5 border-l-2 border-dashed border-[#b58863]/50"
            aria-hidden="true"
          />

          <TimelineGap
            index={0}
            isComplete={isComplete}
          />

          {order.map((eventIndex, position) => (
            <Fragment key={eventIndex}>
              <EventCard
                position={position}
                event={events[eventIndex].event}
                isSelected={selectedIndex === position}
                isComplete={isComplete}
                onSelect={onSelectForSwap}
              />
              <TimelineGap
                index={position + 1}
                isComplete={isComplete}
              />
            </Fragment>
          ))}
        </div>
      </motion.div>
    </DndContext>
  );
}
