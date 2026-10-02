import { cn } from '@utils/cn';
import { motion } from 'motion/react';

const COLUMN_WIDTH = 44;
const LETTER_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const CENTER_ROW = 2;

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
 * answer.
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
  return (
    <div
      className="grid justify-center gap-3"
      style={{
        gridTemplateColumns: `repeat(${words.length}, ${COLUMN_WIDTH}px)`,
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
        const offset = (CENTER_ROW - selectedIndex) * LETTER_HEIGHT;

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
              'relative overflow-hidden rounded-2xl border border-white/70 bg-white/20 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              isLocked && 'bg-gold-soft/80',
            )}
            style={{ height: LETTER_HEIGHT * VISIBLE_ROWS }}
          >
            <div
              className="pointer-events-none absolute left-1/2 rounded-xl border-2 border-gold"
              style={{
                top: CENTER_ROW * LETTER_HEIGHT,
                width: COLUMN_WIDTH,
                height: LETTER_HEIGHT,
                transform: 'translate(-50%, 0)',
              }}
              aria-hidden="true"
            />

            <motion.div
              className="pointer-events-none absolute inset-x-0"
              style={{ y: offset }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            >
              {word.split('').map((letter, index) => {
                const isSelected = index === selectedIndex;
                const isCorrectLetter = isLocked && isSelected;

                return (
                  <div
                    key={`${letter}-${index}`}
                    className={cn(
                      'mx-auto grid h-11 w-11 place-items-center rounded-xl bg-white text-lg font-bold uppercase text-foreground shadow-sm',
                      isCorrectLetter && 'bg-gold text-foreground',
                    )}
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
