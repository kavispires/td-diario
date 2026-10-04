import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import {
  CENTER_ROW,
  COLUMN_GAP,
  MAX_COLUMN_WIDTH,
  MIN_COLUMN_WIDTH,
  VISIBLE_ROWS,
} from '../utils/constants';

/**
 * Props accepted by the {@link Passcode} component.
 */
type PasscodeProps = {
  /**
   * Correct passcode for the active corridor.
   */
  passcode: string;
  /**
   * Most recent submitted guess for the active corridor.
   */
  latestGuess: string;
  /**
   * Rotating word columns used to build the passcode.
   */
  words: string[];
  /**
   * Current selected position for each word column.
   */
  currentCorridorIndexes: number[];
  /**
   * Called when the player rotates a column.
   */
  onSlideWordPosition: (index: number) => void;
  /**
   * Whether every column should be disabled.
   */
  disabled: boolean;
};

/**
 * Renders the slot-like word columns used to assemble Portais' current
 * passcode, locking columns whose selected letter already matches the
 * answer. Column width is measured against the available container width
 * so even long passcodes (many columns) fit on a single line without
 * wrapping, cropping, or scrolling.
 *
 * @param props Passcode, word columns, selected indexes, and interaction handler.
 * @returns The rendered passcode selector.
 */
export function Passcode({
  passcode,
  latestGuess,
  words,
  currentCorridorIndexes,
  onSlideWordPosition,
  disabled,
}: PasscodeProps) {
  const [columnWidth, containerRef] = useCardWidthByContainerRef(
    Math.max(Math.min(words.length, 15), 12),
    {
      gap: COLUMN_GAP,
      minWidth: MIN_COLUMN_WIDTH,
      maxWidth: MAX_COLUMN_WIDTH,
    },
  );
  const letterSize = columnWidth;

  return (
    <div
      ref={containerRef}
      className="grid w-full justify-center"
      style={{
        gridTemplateColumns: `repeat(${words.length}, ${columnWidth}px)`,
        gap: COLUMN_GAP,
      }}
    >
      {words.map((word, wordIndex) => {
        const selectedIndex = Math.max(
          0,
          Math.min(
            word.length - 1,
            word.length - 1 - (currentCorridorIndexes[wordIndex] ?? 0),
          ),
        );
        const selectedLetter = word[selectedIndex] ?? '';
        const isLocked = latestGuess[wordIndex] === passcode[wordIndex];
        const offset = (CENTER_ROW - selectedIndex) * letterSize;

        return (
          <button
            key={`${word}-${wordIndex}`}
            type="button"
            onClick={() => onSlideWordPosition(wordIndex)}
            disabled={disabled || isLocked}
            aria-label={
              isLocked
                ? `Coluna ${wordIndex + 1} travada na letra ${selectedLetter.toUpperCase()}`
                : `Girar coluna ${wordIndex + 1}; letra atual ${selectedLetter.toUpperCase()}`
            }
            className={cn(
              'relative overflow-hidden rounded-xl border border-white/70 bg-white/20 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isLocked && 'bg-gold-soft/80',
            )}
            style={{ height: letterSize * VISIBLE_ROWS }}
          >
            <div
              className="pointer-events-none absolute left-1/2 rounded-lg border-2 border-gold"
              style={{
                top: CENTER_ROW * letterSize,
                width: letterSize,
                height: letterSize,
                transform: 'translate(-50%, 0)',
                zIndex: 10,
              }}
              aria-hidden="true"
            />

            <motion.div
              className="pointer-events-none absolute inset-x-0"
              initial={false}
              animate={{ y: offset }}
              style={{ top: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              {word.split('').map((letter, index) => {
                const isSelected = index === selectedIndex;
                const isCorrectLetter = isLocked && isSelected;

                return (
                  <div
                    key={`${letter}-${index}`}
                    className={cn(
                      'mx-auto grid place-items-center rounded-sm bg-white font-bold uppercase text-foreground shadow-sm',
                      isCorrectLetter && 'bg-gold text-foreground',
                    )}
                    style={{
                      width: letterSize - 2,
                      height: letterSize,
                      fontSize: Math.min(
                        Math.max(8, Math.round(letterSize * 0.42)),
                        letterSize - 2,
                      ),
                    }}
                  >
                    {letter}
                  </div>
                );
              })}
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}
