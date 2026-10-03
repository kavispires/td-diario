import { DailyItem } from '@components/games/DailyItem';
import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { DailyAlienadoRequest } from 'types/games';
import {
  ALIENADO_BOARD_ITEM_FRAME,
  ALIENADO_BOARD_SHAKE_DURATION_SECONDS,
  ALIENADO_BOARD_SHAKE_X,
  ALIENADO_GUESS_DELIMITER,
  MINIMUM_SPRITES_PER_REQUEST,
} from '../utils/constants';
import { AlienSign } from './AlienSign';

/**
 * Props accepted by the {@link Board} component.
 */
type BoardProps = {
  /**
   * Requests the player must satisfy, in order.
   */
  requests: DailyAlienadoRequest[];
  /**
   * Available item ids that can be placed into the request slots.
   */
  itemsIds: string[];
  /**
   * Current slot contents for the in-progress guess.
   */
  selection: Array<string | null>;
  /**
   * Index of the slot currently focused for the next placement.
   */
  slotIndex: number | null;
  /**
   * Previous submitted guesses, split into ordered item-id arrays.
   */
  previousGuesses: string[][];
  /**
   * Pixel width/height used for items and symbols.
   */
  itemWidth: number;
  /**
   * Timestamp of the latest wrong/duplicate attempt, used to retrigger a
   * shake animation.
   */
  latestAttempt: number | null;
  /**
   * Whether the current guess is ready to be submitted.
   */
  isReady: boolean;
  /**
   * Whether the game ended in either a win or a loss.
   */
  isComplete: boolean;
  /**
   * Whether the finished game was a win.
   */
  isWin: boolean;
  /**
   * Focuses a request slot.
   */
  onSelectSlot: (index: number) => void;
  /**
   * Places an available item into the focused or first empty slot.
   */
  onSelectItem: (itemId: string) => void;
  /**
   * Clears an already-filled slot.
   */
  onClearSlot: (index: number) => void;
  /**
   * Submits the current guess.
   */
  onSubmitGuess: () => void;
};

/**
 * Renders Alienado's main play area: the requested symbol combinations, the
 * four answer slots, the available item pool, and the attempt history.
 *
 * @param props Board data, interaction handlers, and responsive sizing.
 * @returns The rendered Alienado board.
 */
export function Board({
  requests,
  itemsIds,
  selection,
  slotIndex,
  previousGuesses,
  itemWidth,
  latestAttempt,
  isReady,
  isComplete,
  isWin,
  onSelectSlot,
  onSelectItem,
  onClearSlot,
  onSubmitGuess,
}: BoardProps) {
  const shouldShake = latestAttempt !== null && !isComplete;

  return (
    <div className="space-y-4">
      <motion.section
        key={latestAttempt ?? 'idle'}
        className="space-y-4 rounded-[2rem] bg-surface/85 p-4 shadow-sm"
        initial={shouldShake ? { x: 0 } : undefined}
        animate={shouldShake ? { x: ALIENADO_BOARD_SHAKE_X } : undefined}
        transition={{
          duration: ALIENADO_BOARD_SHAKE_DURATION_SECONDS,
          ease: 'easeInOut',
        }}
      >
        <Text
          strong
          className="block text-center"
        >
          O alienígena quer essas {requests.length} coisas:
        </Text>

        <div className="grid grid-cols-4 items-start gap-2">
          {requests.map((request, index) => {
            const selectedItemId = selection[index];

            return (
              <RequestSlot
                key={request.itemId}
                index={index}
                request={request}
                selectedItemId={selectedItemId}
                slotIndex={slotIndex}
                itemWidth={itemWidth}
                isComplete={isComplete}
                isWin={isWin}
                onSelectSlot={onSelectSlot}
                onClearSlot={onClearSlot}
              />
            );
          })}
        </div>

        {!isComplete && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="small"
              disabled={!isReady}
              onClick={onSubmitGuess}
            >
              Enviar
            </Button>
          </div>
        )}
      </motion.section>

      <section className="space-y-3 rounded-[2rem] bg-surface/85 p-4 shadow-sm">
        <Text
          strong
          className="block text-center"
        >
          Essas são as coisas disponíveis:
        </Text>

        <div className="flex flex-wrap justify-center gap-2">
          {itemsIds.map((itemId) => {
            const isSelected = selection.includes(itemId);

            return (
              <PoolItem
                key={itemId}
                itemId={itemId}
                itemWidth={itemWidth}
                disabled={isSelected || isComplete}
                isSelected={isSelected}
                onSelectItem={onSelectItem}
              />
            );
          })}
        </div>
      </section>

      {previousGuesses.length > 0 && (
        <section className="space-y-3 rounded-[2rem] bg-surface/85 p-4 shadow-sm">
          <Text
            strong
            className="block text-center"
          >
            {isComplete ? 'Tentativas da rodada' : 'Tentativas anteriores'}
          </Text>

          <div className="space-y-2">
            {previousGuesses.map((guess, guessIndex) => (
              <div
                key={`${guess.join(ALIENADO_GUESS_DELIMITER)}-${guessIndex}`}
                className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-surface-raised p-3"
              >
                {guess.map((itemId, itemIndex) => (
                  <DailyItem
                    key={`${itemId}-${itemIndex}`}
                    itemId={itemId}
                    width={Math.max(
                      itemWidth - ALIENADO_BOARD_ITEM_FRAME.historyWidthOffset,
                      ALIENADO_BOARD_ITEM_FRAME.historyMinWidth,
                    )}
                    padding={ALIENADO_BOARD_ITEM_FRAME.historyPadding}
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/**
 * Props accepted by the {@link RequestSlot} component.
 */
type RequestSlotProps = {
  /**
   * The slot's position among the four requests.
   */
  index: number;
  /**
   * The requested symbol combination this slot must satisfy.
   */
  request: DailyAlienadoRequest;
  /**
   * The item id currently placed in this slot, or `null`.
   */
  selectedItemId: string | null;
  /**
   * Index of the slot currently focused for the next placement.
   */
  slotIndex: number | null;
  /**
   * Pixel width/height used for items and symbols.
   */
  itemWidth: number;
  /**
   * Whether the game ended in either a win or a loss.
   */
  isComplete: boolean;
  /**
   * Whether the finished game was a win.
   */
  isWin: boolean;
  /**
   * Focuses this slot.
   */
  onSelectSlot: (index: number) => void;
  /**
   * Clears this slot.
   */
  onClearSlot: (index: number) => void;
};

/**
 * Renders one of Alienado's four request slots: a droppable target that
 * also doubles as a draggable item once filled, so the player can drag it
 * into another slot to swap, or tap to clear it.
 *
 * @param props Slot data, sizing, and interaction handlers.
 * @returns The rendered request slot.
 */
function RequestSlot({
  index,
  request,
  selectedItemId,
  slotIndex,
  itemWidth,
  isComplete,
  isWin,
  onSelectSlot,
  onClearSlot,
}: RequestSlotProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { index },
    disabled: isComplete,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `slot-drag-${index}`,
    data: { itemId: selectedItemId, source: 'slot' as const, index },
    disabled: isComplete || !selectedItemId,
  });

  const isReceiving = isOver && !isDragging && !isComplete;

  return (
    <div
      ref={setDroppableRef}
      className={cn(
        'flex flex-col items-center gap-2 rounded-2xl border-2 border-transparent bg-surface-raised p-2',
        isComplete &&
          isWin &&
          'border-gold bg-gold-soft shadow-[0_0_0_1px_var(--color-gold)]',
        isReceiving && 'border-primary/50 bg-primary-soft',
      )}
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-xs font-semibold text-foreground">
        {index + 1}
      </div>

      <div className="flex flex-col items-center gap-1">
        {Array(MINIMUM_SPRITES_PER_REQUEST - request.spritesIds.length)
          .fill(null)
          .map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="rounded-full"
              style={{
                width: ALIENADO_BOARD_ITEM_FRAME.requestSignMinWidth,
                height: ALIENADO_BOARD_ITEM_FRAME.requestSignMinWidth,
              }}
            />
          ))}

        {request.spritesIds.map((spriteId) => (
          <AlienSign
            key={`${request.itemId}-${spriteId}`}
            signId={spriteId}
            width={Math.max(
              itemWidth - ALIENADO_BOARD_ITEM_FRAME.requestSignWidthOffset,
              ALIENADO_BOARD_ITEM_FRAME.requestSignMinWidth,
            )}
          />
        ))}
      </div>

      {selectedItemId && !isComplete && (
        <motion.button
          ref={setDraggableRef}
          type="button"
          {...listeners}
          {...attributes}
          onClick={() => onClearSlot(index)}
          disabled={isComplete}
          animate={{
            x: transform ? transform.x : 0,
            y: transform ? transform.y : 0,
            opacity: isDragging ? 0.85 : 1,
          }}
          transition={
            isDragging ? { type: 'tween', duration: 0 } : { duration: 0.15 }
          }
          className={cn(
            'rounded-2xl border-2 border-transparent bg-surface p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50',
            !isComplete && 'cursor-grab hover:border-primary/40',
            isComplete && 'cursor-default border-primary/30 bg-white/80',
          )}
          style={{
            touchAction: 'none',
            zIndex: isDragging ? 50 : 1,
          }}
          aria-label={`Remover item da posição ${index + 1}`}
        >
          <DailyItem
            itemId={selectedItemId}
            width={itemWidth}
            padding={ALIENADO_BOARD_ITEM_FRAME.padding}
          />
        </motion.button>
      )}

      {!selectedItemId && !isComplete && (
        <button
          type="button"
          onClick={() => onSelectSlot(index)}
          disabled={isComplete}
          className={cn(
            'flex items-center justify-center rounded-2xl border-2 border-dashed border-border-strong bg-surface text-2xl font-semibold text-subtle-foreground transition focus:outline-none focus:ring-2 focus:ring-primary/50',
            slotIndex === index &&
              'border-primary bg-primary-soft text-primary',
          )}
          style={{
            width: itemWidth,
            height: itemWidth,
          }}
          aria-label={`Selecionar a posição ${index + 1}`}
        >
          ?
        </button>
      )}

      {isComplete && (
        <div className="rounded-2xl bg-white/80 p-1">
          <DailyItem
            itemId={request.itemId}
            width={itemWidth}
            padding={ALIENADO_BOARD_ITEM_FRAME.padding}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Props accepted by the {@link PoolItem} component.
 */
type PoolItemProps = {
  /**
   * The pool item's id.
   */
  itemId: string;
  /**
   * Pixel width/height used for the item.
   */
  itemWidth: number;
  /**
   * Whether the item can't currently be picked up.
   */
  disabled: boolean;
  /**
   * Whether the item is already placed into a slot.
   */
  isSelected: boolean;
  /**
   * Places the item into the focused or first empty slot.
   */
  onSelectItem: (itemId: string) => void;
};

/**
 * Renders one of Alienado's available pool items as both a tap target and
 * a draggable source: dragging it over a request slot places it there,
 * while a plain tap falls back to the existing select-a-slot-first flow.
 *
 * @param props Item data, sizing, and interaction handler.
 * @returns The rendered pool item.
 */
function PoolItem({
  itemId,
  itemWidth,
  disabled,
  isSelected,
  onSelectItem,
}: PoolItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `pool-${itemId}`,
      data: { itemId, source: 'pool' as const },
      disabled,
    });

  return (
    <motion.button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      onClick={() => onSelectItem(itemId)}
      disabled={disabled}
      animate={{
        x: transform ? transform.x : 0,
        y: transform ? transform.y : 0,
        opacity: isDragging ? 0.85 : 1,
      }}
      transition={
        isDragging ? { type: 'tween', duration: 0 } : { duration: 0.15 }
      }
      className={cn(
        'rounded-2xl border-2 border-transparent bg-surface-raised p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50',
        !isSelected && !disabled && 'cursor-grab hover:border-primary/40',
        isSelected && 'cursor-not-allowed opacity-40 grayscale',
      )}
      style={{
        touchAction: 'none',
        zIndex: isDragging ? 50 : 1,
      }}
      aria-label={`Escolher item ${itemId}`}
    >
      <DailyItem
        itemId={itemId}
        width={itemWidth}
        padding={ALIENADO_BOARD_ITEM_FRAME.padding}
      />
    </motion.button>
  );
}
