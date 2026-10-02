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
    <div className="flex w-full flex-col gap-2 rounded-[2rem] bg-card px-3 py-4 shadow-sm">
      {KEYBOARD_ROWS.map((row) => (
        <div
          key={row}
          className="flex items-center justify-center gap-1.5"
        >
          {row.split('').map((displayLetter) => {
            const letter = displayLetter.toLowerCase();
            const guess = guesses[letter];
            const isCorrect = guess?.state === 'correct';
            const isIncorrect = guess?.state === 'incorrect';

            return (
              <button
                key={displayLetter}
                type="button"
                aria-label={`Escolher a letra ${displayLetter}`}
                disabled={disabled || guess?.disabled}
                className={`flex h-10 min-w-0 flex-1 items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${
                  isCorrect
                    ? 'border-gold bg-gold-soft text-foreground'
                    : isIncorrect
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : 'border-border bg-white text-foreground hover:border-primary hover:bg-primary-soft'
                }`}
                onClick={() => onGuess(letter)}
              >
                {displayLetter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
