import { Surface } from '@components/ui/Surface';
import { cn } from '@utils/cn';
import { isGuessableCharacter, normalizeCharacter } from '@utils/prompts';
import { useMemo } from 'react';

/**
 * Props accepted by the {@link LetterPrompt} component.
 */
type LetterPromptProps = {
  /**
   * Secret text the player is trying to discover.
   */
  text: string;
  /**
   * Normalized solution characters already discovered by the player.
   */
  solution: Dictionary<boolean>;
  /**
   * Whether digits should count as guessable characters too. Defaults to
   * `false`.
   */
  allowNumbers?: boolean;
  /**
   * Standalone word that, when present, is rendered on its own row instead
   * of as guessable characters, used to visually separate two halves of a
   * prompt (e.g. Filmaco's double-feature divider).
   */
  separatorWord?: string;
};

/**
 * Renders a masked word-guessing prompt, revealing letters and (optionally)
 * digits only after the corresponding normalized guess has been found,
 * shared by letter-guessing games (e.g. Filmaco, Arte Ruim).
 *
 * @param props Prompt text, discovered-solution map, and display options.
 * @returns The rendered letter-guessing prompt.
 */
export function LetterPrompt({
  text,
  solution,
  allowNumbers = false,
  separatorWord,
}: LetterPromptProps) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <Surface className="flex w-full flex-wrap justify-center gap-x-5 gap-y-4 bg-primary-soft p-2 uppercase">
      {words.map((word, wordIndex) => {
        if (separatorWord && word === separatorWord) {
          return (
            <div
              key={`${word}-${wordIndex}`}
              className="flex w-full basis-full items-center justify-center py-0 text-lg font-bold text-foreground/50"
            >
              {word}
            </div>
          );
        }

        return (
          <div
            key={`${word}-${wordIndex}`}
            className="flex flex-wrap justify-center gap-0.5"
          >
            {Array.from(word).map((character, characterIndex) => {
              const isGuessable = isGuessableCharacter(character, allowNumbers);
              const isRevealed =
                isGuessable && Boolean(solution[normalizeCharacter(character)]);

              return (
                <div
                  key={`${wordIndex}-${characterIndex}-${character}`}
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-xl border text-sm font-bold shadow-sm',
                    isGuessable &&
                      isRevealed &&
                      'border-gold bg-gold text-chrome',
                    isGuessable &&
                      !isRevealed &&
                      'border-border-strong bg-surface-raised text-transparent',
                    !isGuessable &&
                      'border-none shadow-none bg-card text-foreground/70',
                  )}
                >
                  {isGuessable ? (
                    isRevealed ? (
                      <span>{character}</span>
                    ) : (
                      <span />
                    )
                  ) : (
                    <span>{character}</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </Surface>
  );
}
