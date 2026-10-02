import { useMemo } from 'react';
import { isPlayableLetter, normalizeLetter } from '../utils/helpers';

/**
 * Props accepted by the {@link Prompt} component.
 */
type PromptProps = {
  /**
   * Secret expression shown as blanks and revealed letters.
   */
  text: string;
  /**
   * Dictionary keyed by unique letters in the answer.
   */
  solution: Dictionary<boolean>;
};

/**
 * Renders today's Arte Ruim expression with blanks for hidden letters and
 * visible punctuation/spaces preserved.
 *
 * @param props Answer text plus the currently revealed solution dictionary.
 * @returns The masked prompt board.
 */
export function Prompt({ text, solution }: PromptProps) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-[2rem] bg-card px-4 py-5 text-center shadow-sm">
      {words.map((word, wordIndex) => (
        <div
          key={`${word}-${wordIndex}`}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {word.split('').map((character, characterIndex) => {
            const normalizedCharacter = normalizeLetter(character);
            const isLetter = isPlayableLetter(normalizedCharacter);
            const isRevealed = isLetter && solution[normalizedCharacter];

            return (
              <span
                key={`${character}-${wordIndex}-${characterIndex}`}
                className={`flex h-11 w-9 items-center justify-center rounded-2xl border-2 text-base font-semibold shadow-sm ${
                  isLetter
                    ? isRevealed
                      ? 'border-gold bg-gold-soft text-foreground'
                      : 'border-border bg-white text-transparent'
                    : 'border-border-strong bg-border text-foreground'
                }`}
              >
                {isLetter ? (isRevealed ? character : '_') : character}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
