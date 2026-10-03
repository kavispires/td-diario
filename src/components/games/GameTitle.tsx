import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import type { ReactNode } from 'react';

/**
 * Optional classes for overriding specific parts of {@link GameTitle}.
 */
type GameTitleClassNames = {
  /**
   * Classes merged onto the outermost container.
   */
  root?: string;
  /**
   * Classes merged onto the title text.
   */
  title?: string;
  /**
   * Classes merged onto the description text.
   */
  description?: string;
};

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
  /**
   * Optional classes to override the root container, title, or description.
   */
  classNames?: GameTitleClassNames;
};

/**
 * Renders a game's title block: a bold heading, an optional muted
 * description, and optional extra content, stacked and centered above the
 * game's board.
 *
 * @param props Title, optional description, optional extra children, and
 *   optional per-part classes.
 * @returns The rendered title block.
 */
export function GameTitle({
  title,
  description,
  children,
  classNames,
}: GameTitleProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-md flex-col items-center gap-1',
        classNames?.root,
      )}
    >
      <div className="flex w-full items-center justify-center">
        <Text
          strong
          className={classNames?.title}
        >
          {title}
        </Text>
      </div>

      {description && (
        <Text
          type="secondary"
          className={cn('text-center', classNames?.description)}
        >
          {description}
        </Text>
      )}

      {children}
    </div>
  );
}
