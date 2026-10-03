import { Tooltip } from '@components/ui/Tooltip';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import {
  LOCATION_FRAGMENT_PLACEHOLDER,
  TYPING_CURSOR_BLINK_DURATION_SECONDS,
} from '../utils/constants';

/**
 * Props accepted by the {@link GuessedLocation} component.
 */
type GuessedLocationProps = {
  /**
   * Raw guess currently being typed by the player.
   */
  typedLocation: string;
  /**
   * Revealed letter fragments discovered from previous guesses.
   */
  fragments: string[];
};

/**
 * Shows the guess currently being typed, highlighting characters that line
 * up with the already-revealed fragments.
 *
 * @param props Current typed guess and revealed fragments.
 * @returns A stylized guess preview with a blinking cursor.
 */
export function GuessedLocation({
  typedLocation,
  fragments,
}: GuessedLocationProps) {
  const displayText = useMemo(() => typedLocation.split(''), [typedLocation]);

  const highlightedIndices = useMemo(() => {
    const highlighted = new Set<number>();

    function findNextLetterFragment(startIndex: number): number {
      for (let index = startIndex; index < fragments.length; index += 1) {
        if (fragments[index] !== LOCATION_FRAGMENT_PLACEHOLDER) {
          return index;
        }
      }

      return -1;
    }

    let fragmentIndex = findNextLetterFragment(0);
    if (fragmentIndex === -1) {
      return highlighted;
    }

    for (const [index, character] of Array.from(typedLocation).entries()) {
      const expectedCharacter = fragments[fragmentIndex];

      if (character.toUpperCase() === expectedCharacter) {
        highlighted.add(index);
        fragmentIndex = findNextLetterFragment(fragmentIndex + 1);
        if (fragmentIndex === -1) {
          break;
        }
      }
    }

    return highlighted;
  }, [fragments, typedLocation]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {displayText.length === 0 && (
        <Text type="secondary">Seu palpite aparece aqui.</Text>
      )}

      {displayText.map((character, index) => (
        <span
          key={`${character}-${index}`}
          className={cn(
            'text-xl font-bold uppercase text-foreground',
            highlightedIndices.has(index) && 'text-success',
          )}
        >
          {character === ' ' ? '\u00A0' : character}
        </span>
      ))}

      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: TYPING_CURSOR_BLINK_DURATION_SECONDS,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: 'reverse',
        }}
        className="text-xl font-semibold text-primary"
      >
        |
      </motion.span>
    </div>
  );
}

/**
 * Props accepted by the {@link LocationFragments} component.
 */
type LocationFragmentsProps = {
  /**
   * Revealed letter fragments discovered from previous guesses.
   */
  fragments: string[];
};

/**
 * Renders the answer fragment tooltip/strip that hints which letters are
 * already known and where unknown runs remain.
 *
 * @param props Revealed fragments to display.
 * @returns The rendered fragment strip, or `null` when nothing exists yet.
 */
export function LocationFragments({ fragments }: LocationFragmentsProps) {
  if (fragments.length === 0) {
    return null;
  }

  return (
    <Tooltip title="Partes do nome que você já revelou; as barras cinzas ainda podem ser letras ou espaços.">
      <div className="flex flex-wrap items-center justify-center gap-1.5 px-5 py-2 text-center">
        {fragments.map((fragment, index) =>
          fragment === LOCATION_FRAGMENT_PLACEHOLDER ? (
            <span
              key={`${fragment}-${index}`}
              className="h-6 w-8 rounded-full bg-border-strong"
              aria-hidden="true"
            />
          ) : (
            <span
              key={`${fragment}-${index}`}
              className="text-xl font-bold uppercase text-success"
            >
              {fragment}
            </span>
          ),
        )}
      </div>
    </Tooltip>
  );
}
