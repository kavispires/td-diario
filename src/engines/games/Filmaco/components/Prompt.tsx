import { Surface } from '@components/ui/Surface';
import { cn } from '@utils/cn';
import { useMemo } from 'react';
import {
  isGuessableFilmacoCharacter,
  normalizeFilmacoCharacter,
} from '../utils/helpers';

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
    <Surface className="flex w-full flex-wrap justify-center gap-x-3 gap-y-4 bg-primary-soft p-2 uppercase">
      {words.map((word, wordIndex) => (
        <div
          key={`${word}-${wordIndex}`}
          className="flex flex-wrap justify-center gap-0.5"
        >
          {Array.from(word).map((character, characterIndex) => {
            const isGuessable = isGuessableFilmacoCharacter(character, true);
            const isRevealed =
              isGuessable &&
              Boolean(solution[normalizeFilmacoCharacter(character)]);

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
                  !isGuessable && 'border-border bg-card text-foreground/70',
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
      ))}
    </Surface>
  );
}
