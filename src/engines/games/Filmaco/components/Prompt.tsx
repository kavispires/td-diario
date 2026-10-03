import { Surface } from '@components/ui/Surface';
import { cn } from '@utils/cn';
import { isGuessableCharacter, normalizeCharacter } from '@utils/prompts';
import { useMemo } from 'react';
import { DOUBLE_FEATURE_CHARACTER } from '../utils/constants';

/**
 * Props accepted by the {@link Prompt} component.
 */
type PromptProps = {
  /**
   * Movie title the player is trying to discover.
   */
  text: string;
  /**
   * Normalized solution characters already discovered by the player.
   */
  solution: Dictionary<boolean>;
};

/**
 * Renders Filmaco's masked movie title, revealing letters and numbers only
 * after the corresponding normalized guess has been found.
 *
 * @param props Movie title and discovered-solution map.
 * @returns The rendered Filmaco prompt.
 */
export function Prompt({ text, solution }: PromptProps) {
  const words = useMemo(() => text.split(' '), [text]);

  return (
    <Surface className="flex w-full flex-wrap justify-center gap-x-5 gap-y-4 bg-primary-soft p-2 uppercase">
      {words.map((word, wordIndex) => {
        const isDoubleFeatureSeparator = word === DOUBLE_FEATURE_CHARACTER;

        if (isDoubleFeatureSeparator) {
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
              const isGuessable = isGuessableCharacter(character, true);
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
