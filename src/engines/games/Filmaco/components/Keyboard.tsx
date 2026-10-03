import { cn } from '@utils/cn';
import { getLetterPoints } from '@utils/letterPoints';
import { useEffect } from 'react';
import { gameInfo } from '../info';
import type { LettersDictionary } from '../utils/types';

const NUMBER_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'] as const;
const FIRST_ROW = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] as const;
const SECOND_ROW = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] as const;
const THIRD_ROW = ['z', 'x', 'c', 'v', 'b', 'n', 'm'] as const;
const ROWS = [NUMBER_ROW, FIRST_ROW, SECOND_ROW, THIRD_ROW] as const;

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
    <div className="flex w-full flex-col items-center gap-1.5">
      {ROWS.map((row) => (
        <div
          key={row.join('')}
          className="flex justify-center gap-1.5"
        >
          {row.map((key) => {
            const keyState = lettersState[key]?.state;
            const isKeyDisabled = disabled || lettersState[key]?.disabled;
            const points = getLetterPoints(key);

            return (
              <button
                key={key}
                type="button"
                aria-label={`Palpite ${key.toUpperCase()}, vale ${points} ponto${points > 1 ? 's' : ''}`}
                aria-pressed={!!keyState}
                disabled={isKeyDisabled}
                onClick={() => onLetterClick(key)}
                style={
                  keyState ? undefined : { backgroundColor: gameInfo.color }
                }
                className={cn(
                  'flex h-10 w-7 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md text-sm font-bold uppercase text-white shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-transform duration-100 active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
                  keyState === 'correct' &&
                    'bg-success shadow-[0_3px_0_rgba(0,0,0,0.35)]',
                  keyState === 'incorrect' &&
                    'bg-destructive shadow-[0_3px_0_rgba(0,0,0,0.35)]',
                )}
              >
                <span>{key}</span>
                <span
                  className="flex gap-0.5"
                  aria-hidden="true"
                >
                  {Array.from({ length: points }, (_, index) => (
                    <span
                      key={`${key}-dot-${index}`}
                      className="h-0.5 w-0.5 rounded-full bg-white/80"
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
