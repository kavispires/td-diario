import { DailyItem } from '@components/games/DailyItem';
import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { DailyAlienadoRequest } from 'types/games';
import {
  ALIENADO_BOARD_ITEM_FRAME,
  ALIENADO_BOARD_SHAKE_DURATION_SECONDS,
  ALIENADO_BOARD_SHAKE_X,
  ALIENADO_GUESS_DELIMITER,
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
        <Text strong>O alienígena quer isso:</Text>

        <div className="grid grid-cols-2 gap-3">
          {requests.map((request, index) => {
            const selectedItemId = selection[index];

            return (
              <div
                key={request.itemId}
                className={cn(
                  'flex min-h-[190px] flex-col items-center gap-3 rounded-3xl border-2 border-transparent bg-surface-raised p-3',
                  isComplete &&
                    isWin &&
                    'border-gold bg-gold-soft shadow-[0_0_0_1px_var(--color-gold)]',
                )}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-soft text-sm font-semibold text-foreground">
                  {index + 1}
                </div>

                <div className="flex items-center gap-2">
                  {request.spritesIds.map((spriteId) => (
                    <AlienSign
                      key={`${request.itemId}-${spriteId}`}
                      signId={spriteId}
                      width={Math.max(
                        itemWidth -
                          ALIENADO_BOARD_ITEM_FRAME.requestSignWidthOffset,
                        ALIENADO_BOARD_ITEM_FRAME.requestSignMinWidth,
                      )}
                    />
                  ))}
                </div>

                {selectedItemId ? (
                  <button
                    type="button"
                    onClick={() => onClearSlot(index)}
                    disabled={isComplete}
                    className={cn(
                      'rounded-2xl border-2 border-transparent bg-surface p-1 transition focus:outline-none focus:ring-2 focus:ring-primary/50',
                      !isComplete && 'hover:border-primary/40',
                      isComplete &&
                        'cursor-default border-primary/30 bg-white/80',
                    )}
                    aria-label={`Remover item da posição ${index + 1}`}
                  >
                    <DailyItem
                      itemId={selectedItemId}
                      width={itemWidth}
                      padding={ALIENADO_BOARD_ITEM_FRAME.padding}
                    />
                  </button>
                ) : (
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
                      width: ALIENADO_BOARD_ITEM_FRAME.emptySlotSize,
                      height: ALIENADO_BOARD_ITEM_FRAME.emptySlotSize,
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
        <Text strong>E essas são as coisas disponíveis:</Text>

        <div className="flex flex-wrap justify-center gap-2">
          {itemsIds.map((itemId) => {
            const isSelected = selection.includes(itemId);

            return (
              <button
                key={itemId}
                type="button"
                onClick={() => onSelectItem(itemId)}
                disabled={isSelected || isComplete}
                className={cn(
                  'rounded-2xl border-2 border-transparent bg-surface-raised p-1 transition focus:outline-none focus:ring-2 focus:ring-primary/50',
                  !isSelected && !isComplete && 'hover:border-primary/40',
                  isSelected && 'cursor-not-allowed opacity-40 grayscale',
                )}
                aria-label={`Escolher item ${itemId}`}
              >
                <DailyItem
                  itemId={itemId}
                  width={itemWidth}
                  padding={ALIENADO_BOARD_ITEM_FRAME.padding}
                />
              </button>
            );
          })}
        </div>
      </section>

      {previousGuesses.length > 0 && (
        <section className="space-y-3 rounded-[2rem] bg-surface/85 p-4 shadow-sm">
          <Text strong>
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
