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
    <div className="flex w-full flex-wrap justify-center gap-x-3 gap-y-4 rounded-[2rem] bg-primary-soft px-4 py-5 uppercase shadow-sm">
      {words.map((word, wordIndex) => (
        <div
          key={`${word}-${wordIndex}`}
          className="flex flex-wrap justify-center gap-2"
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
                  'flex h-11 w-11 items-center justify-center rounded-2xl border text-lg font-bold shadow-sm',
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
                    <span
                      className="h-1.5 w-5 rounded-full bg-border-strong"
                      aria-hidden="true"
                    />
                  )
                ) : (
                  <span>{character}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
