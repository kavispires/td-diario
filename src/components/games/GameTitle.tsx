import { Text } from '@components/ui/Typography';
import type { ReactNode } from 'react';

/**
 * Props accepted by the {@link GameTitle} component.
 */
type GameTitleProps = {
  /**
   * Main heading shown above the game's board, rendered as bold text.
   * Typically a puzzle's subject, such as a movie's year or a card's name.
   */
  title: ReactNode;
  /**
   * Optional secondary line rendered below the title in muted, centered
   * text, typically used for short gameplay instructions.
   */
  description?: ReactNode;
  /**
   * Optional additional content rendered below the description, such as
   * extra hints specific to a game.
   */
  children?: ReactNode;
};

/**
 * Renders a game's title block: a bold heading, an optional muted
 * description, and optional extra content, stacked and centered above the
 * game's board.
 *
 * @param props Title, optional description, and optional extra children.
 * @returns The rendered title block.
 */
export function GameTitle({ title, description, children }: GameTitleProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-1">
      <div className="flex w-full items-center justify-center">
        <Text strong>{title}</Text>
      </div>

      {description && (
        <Text
          type="secondary"
          className="text-center"
        >
          {description}
        </Text>
      )}

      {children}
    </div>
  );
}
