import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { pluralize } from '@utils/helpers';
import { Coins } from 'lucide-react';

/**
 * Props accepted by the {@link Score} component.
 */
type ScoreProps = {
  /**
   * Player's final score for the game.
   */
  value: number;
  /**
   * Optional additional CSS classes to apply to the score text.
   */
  className?: string;
};

/**
 * Renders a game's final score with a coin icon, for use in results
 * splashes.
 *
 * @param props The score value to display.
 * @returns A styled, inline score label.
 */
export function Score({
  value,
  className,
}: ScoreProps & { className?: string }) {
  return (
    <Text
      type="secondary"
      className={cn('text-center', className)}
    >
      <Coins
        className="inline-block mr-1"
        size={16}
      />
      {value} {pluralize(value, 'ponto', 'pontos')}
    </Text>
  );
}
