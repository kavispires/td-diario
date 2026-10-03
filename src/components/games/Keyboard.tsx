import { cn } from '@utils/cn';
import { getLetterPoints } from '@utils/prompts';
import { useEffect, useMemo } from 'react';

/**
 * Digit row shown above the letters when {@link KeyboardProps.withNumbers}
 * is enabled.
 */
const NUMBERS_ROW = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

/**
 * QWERTY letter rows always rendered by the keyboard, top to bottom.
 */
const LETTER_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

/**
 * Visual feedback applied to an on-screen keyboard key once a player has
 * guessed it.
 */
export type KeyboardKeyState = {
  /**
   * Whether the guess was correct or incorrect.
   */
  state?: 'correct' | 'incorrect';
  /**
   * Whether the key should stay disabled (already guessed).
   */
  disabled?: boolean;
};

/**
 * Props accepted by the shared {@link Keyboard} component.
 */
type KeyboardProps = {
  /**
   * Visual state of every guessed key, keyed by lowercase character.
   */
  keysState: Dictionary<KeyboardKeyState>;
  /**
   * Called with the lowercase character when the player selects a key,
   * either by clicking it or pressing the matching physical key.
   */
  onKeyPress: (key: string) => void;
  /**
   * Whether the whole keyboard should stop accepting input.
   */
  disabled?: boolean;
  /**
   * Game theme color used as each key's default background.
   */
  color: string;
  /**
   * Builds the accessible label for a key, given its character and point
   * value. Defaults to a generic pt-BR label.
   */
  getAriaLabel?: (key: string, points: number) => string;
  /**
   * Whether to render the digit row above the letters.
   */
  withNumbers?: boolean;
  /**
   * Whether to render a space bar key, reporting `' '` via `onKeyPress`.
   */
  withSpaceBar?: boolean;
  /**
   * Renders an "Enter" key that calls this handler when pressed, either
   * on-screen or via the physical Enter key.
   */
  onEnterClick?: () => void;
  /**
   * Renders a "Backspace" key that calls this handler when pressed, either
   * on-screen or via the physical Backspace key.
   */
  onBackspaceClick?: () => void;
  /**
   * Whether to render the small point-value dots under each letter/digit
   * key. Defaults to `true`; disable for games where per-key scoring
   * isn't relevant (e.g. free-text word building).
   */
  withScoreDots?: boolean;
  /**
   * Color class applied to keys marked `incorrect`. Defaults to the
   * standard destructive red; pass an override (e.g. a neutral gray) for
   * games where an incorrect letter isn't a penalized "wrong" guess, such
   * as Mapeamento's free exploration of letters.
   */
  incorrectClassName?: string;
};

/**
 * Renders the on-screen keyboard shared by letter-guessing and
 * free-text-building games (e.g. Filmaco, Arte Ruim, Mapeamento): solid
 * per-game-color 3D keycaps with point indicator dots, correct/incorrect
 * feedback, optional digit row/space bar/enter/backspace keys, and
 * physical keyboard support that mirrors on-screen presses.
 *
 * @param props Guess state, handlers, and styling/layout options.
 * @returns The rendered keyboard.
 */
export function Keyboard({
  keysState,
  onKeyPress,
  disabled = false,
  color,
  getAriaLabel = (key, points) =>
    `Tecla ${key.toUpperCase()}, vale ${points} ponto${points > 1 ? 's' : ''}`,
  withNumbers = false,
  withSpaceBar = false,
  onEnterClick,
  onBackspaceClick,
  withScoreDots,
  incorrectClassName = 'bg-destructive',
}: KeyboardProps) {
  const rows = useMemo(
    () => (withNumbers ? [NUMBERS_ROW, ...LETTER_ROWS] : LETTER_ROWS),
    [withNumbers],
  );
  const validKeys = useMemo(() => new Set(rows.flat()), [rows]);

  useEffect(() => {
    if (disabled) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' && onEnterClick) {
        onEnterClick();
        return;
      }

      if (event.key === 'Backspace' && onBackspaceClick) {
        onBackspaceClick();
        return;
      }

      if (event.key === ' ' && withSpaceBar) {
        event.preventDefault();
        onKeyPress(' ');
        return;
      }

      const key = event.key.toLowerCase();

      if (!validKeys.has(key) || keysState[key]?.disabled) {
        return;
      }

      onKeyPress(key);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    disabled,
    keysState,
    onKeyPress,
    validKeys,
    onEnterClick,
    onBackspaceClick,
    withSpaceBar,
  ]);

  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      {rows.map((row) => (
        <div
          key={row.join('')}
          className="flex justify-center gap-1.5"
        >
          {row.map((key) => {
            const keyState = keysState[key]?.state;
            const isKeyDisabled = disabled || keysState[key]?.disabled;
            const points = getLetterPoints(key);

            return (
              <button
                key={key}
                type="button"
                aria-label={getAriaLabel(key, points)}
                aria-pressed={!!keyState}
                disabled={isKeyDisabled}
                onClick={() => onKeyPress(key)}
                style={keyState ? undefined : { backgroundColor: color }}
                className={cn(
                  'flex h-10 w-7 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md text-sm font-bold uppercase text-white shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-transform duration-100 active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
                  keyState === 'correct' &&
                    'bg-success shadow-[0_3px_0_rgba(0,0,0,0.35)]',
                  keyState === 'incorrect' &&
                    cn(incorrectClassName, 'shadow-[0_3px_0_rgba(0,0,0,0.35)]'),
                )}
              >
                <span>{key}</span>
                {withScoreDots && (
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
                )}
              </button>
            );
          })}
        </div>
      ))}

      {(onEnterClick || withSpaceBar || onBackspaceClick) && (
        <div className="flex w-full justify-center gap-1.5">
          {onEnterClick && (
            <button
              type="button"
              aria-label="Confirmar palpite"
              disabled={disabled}
              onClick={onEnterClick}
              style={{ backgroundColor: color }}
              className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md text-xs font-bold uppercase text-white shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-transform duration-100 active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Enter
            </button>
          )}
          {withSpaceBar && (
            <button
              type="button"
              aria-label="Espaço"
              disabled={disabled}
              onClick={() => onKeyPress(' ')}
              style={{ backgroundColor: color }}
              className="flex h-10 max-w-40 flex-1 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-transform duration-100 active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              ␣
            </button>
          )}
          {onBackspaceClick && (
            <button
              type="button"
              aria-label="Apagar"
              disabled={disabled}
              onClick={onBackspaceClick}
              style={{ backgroundColor: color }}
              className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-transform duration-100 active:translate-y-[2px] active:shadow-[0_1px_0_rgba(0,0,0,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              ⌫
            </button>
          )}
        </div>
      )}
    </div>
  );
}
