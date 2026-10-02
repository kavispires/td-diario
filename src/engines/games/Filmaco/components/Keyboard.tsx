import { cn } from '@utils/cn';
import { useEffect } from 'react';
import type { LettersDictionary } from '../utils/types';

const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;
const FIRST_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] as const;
const SECOND_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] as const;
const THIRD_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'] as const;

/**
 * Props accepted by the {@link Keyboard} component.
 */
type KeyboardProps = {
  /**
   * Visual state of every guessed keyboard key.
   */
  lettersState: LettersDictionary;
  /**
   * Handles one guessed key press.
   */
  onLetterClick: (letter: string) => void;
  /**
   * Whether the entire keyboard should stop accepting guesses.
   */
  disabled?: boolean;
};

/**
 * Renders Filmaco's on-screen keyboard and mirrors physical keyboard
 * presses for letters and digits.
 *
 * @param props Keyboard state, click handler, and disabled flag.
 * @returns The rendered Filmaco keyboard.
 */
export function Keyboard({
  lettersState,
  onLetterClick,
  disabled = false,
}: KeyboardProps) {
  useEffect(() => {
    if (disabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (!/^[a-z0-9]$/i.test(key) || lettersState[key]?.disabled) {
        return;
      }

      onLetterClick(key);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, lettersState, onLetterClick]);

  return (
    <div className="grid w-full gap-2 rounded-[2rem] bg-card px-3 py-4 shadow-sm">
      <KeyboardRow
        keys={NUMBER_ROW}
        lettersState={lettersState}
        onLetterClick={onLetterClick}
        disabled={disabled}
        columns={10}
      />
      <KeyboardRow
        keys={FIRST_ROW}
        lettersState={lettersState}
        onLetterClick={onLetterClick}
        disabled={disabled}
        columns={10}
      />
      <KeyboardRow
        keys={SECOND_ROW}
        lettersState={lettersState}
        onLetterClick={onLetterClick}
        disabled={disabled}
        columns={9}
      />
      <KeyboardRow
        keys={THIRD_ROW}
        lettersState={lettersState}
        onLetterClick={onLetterClick}
        disabled={disabled}
        columns={7}
      />
    </div>
  );
}

/**
 * Props accepted by the internal {@link KeyboardRow} helper.
 */
type KeyboardRowProps = {
  /**
   * Characters rendered in this keyboard row.
   */
  keys: readonly string[];
  /**
   * Visual state of every guessed keyboard key.
   */
  lettersState: LettersDictionary;
  /**
   * Handles one guessed key press.
   */
  onLetterClick: (letter: string) => void;
  /**
   * Whether the row should stop accepting guesses.
   */
  disabled: boolean;
  /**
   * Number of equal-width columns this row should use.
   */
  columns: number;
};

/**
 * Renders one row of Filmaco keyboard keys.
 *
 * @param props Row keys, state, click handler, and layout information.
 * @returns One keyboard row.
 */
function KeyboardRow({
  keys,
  lettersState,
  onLetterClick,
  disabled,
  columns,
}: KeyboardRowProps) {
  return (
    <div
      className={cn('grid gap-2', {
        'grid-cols-10': columns === 10,
        'grid-cols-9': columns === 9,
        'grid-cols-7': columns === 7,
      })}
    >
      {keys.map((key) => {
        const keyState = lettersState[key]?.state;
        const isKeyDisabled = disabled || lettersState[key]?.disabled;

        return (
          <button
            key={key}
            type="button"
            className={cn(
              'aspect-square rounded-2xl border text-sm font-semibold uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card',
              keyState === 'correct' &&
                'border-gold bg-gold text-chrome shadow-sm',
              keyState === 'incorrect' &&
                'border-destructive bg-destructive text-white shadow-sm',
              !keyState &&
                'border-border bg-surface-raised text-foreground hover:bg-primary-soft',
              isKeyDisabled && 'cursor-not-allowed',
            )}
            aria-label={`Palpite ${key.toUpperCase()}`}
            aria-pressed={!!keyState}
            disabled={isKeyDisabled}
            onClick={() => onLetterClick(key)}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
