import { cn } from '@utils/cn';
import { getLetterPoints } from '@utils/letterPoints';
import { gameInfo } from '../info';
import { KEYBOARD_ROWS } from '../utils/helpers';
import type { LettersDictionary } from '../utils/types';

/**
 * Props accepted by the {@link Keyboard} component.
 */
type KeyboardProps = {
  /**
   * Dictionary keyed by letters already attempted by the player.
   */
  guesses: LettersDictionary;
  /**
   * Whether the whole keyboard should stop accepting input.
   */
  disabled: boolean;
  /**
   * Called when the player selects a letter.
   */
  onGuess: (letter: string) => void;
};

/**
 * Renders Arte Ruim's on-screen letter keyboard.
 *
 * @param props Guess state, disable flag, and guess handler.
 * @returns The rendered keyboard.
 */
export function Keyboard({ guesses, disabled, onGuess }: KeyboardProps) {
  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      {KEYBOARD_ROWS.map((row) => (
        <div
          key={row}
          className="flex justify-center gap-1.5"
        >
          {row.split('').map((displayLetter) => {
            const letter = displayLetter.toLowerCase();
            const guess = guesses[letter];
            const keyState = guess?.state;
            const isKeyDisabled = disabled || guess?.disabled;
            const points = getLetterPoints(letter);

            return (
              <button
                key={displayLetter}
                type="button"
                aria-label={`Escolher a letra ${displayLetter}, vale ${points} ponto${points > 1 ? 's' : ''}`}
                aria-pressed={!!keyState}
                disabled={isKeyDisabled}
                onClick={() => onGuess(letter)}
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
                <span>{displayLetter}</span>
                <span
                  className="flex gap-0.5"
                  aria-hidden="true"
                >
                  {Array.from({ length: points }, (_, index) => (
                    <span
                      key={`${displayLetter}-dot-${index}`}
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
