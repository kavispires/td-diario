import { Surface } from '@components/ui/Surface';
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
    <div className="flex min-h-16 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-border px-4 py-3">
      {displayText.length === 0 && (
        <Text type="secondary">Seu palpite aparece aqui.</Text>
      )}

      {displayText.map((character, index) => (
        <span
          key={`${character}-${index}`}
          className={cn(
            'min-w-6 rounded-lg px-1 py-1 text-center text-lg font-semibold text-foreground',
            character === ' ' && 'bg-border/70',
            highlightedIndices.has(index) && 'bg-gold-soft text-foreground',
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
        className="text-lg font-semibold text-primary"
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
    <Tooltip title="Partes do nome que você já revelou; os blocos cinza ainda podem ser letras ou espaços.">
      <Surface className="flex flex-wrap items-center justify-center gap-2 bg-card px-5 py-4 text-center">
        {fragments.map((fragment, index) => (
          <span
            key={`${fragment}-${index}`}
            className={cn(
              'flex min-h-10 min-w-10 items-center justify-center rounded-xl px-2 py-2 text-lg font-semibold shadow-sm',
              fragment === LOCATION_FRAGMENT_PLACEHOLDER
                ? 'bg-border text-border-strong'
                : 'bg-white text-foreground',
            )}
          >
            {fragment}
          </span>
        ))}
      </Surface>
    </Tooltip>
  );
}
