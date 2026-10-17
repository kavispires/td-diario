import { GameLogos } from '@components/hub/GameLogos';
import { NewsIcon } from '@components/news/NewsIcon';
import { DualTranslate } from '@components/ui/DualTranslate';
import { Paragraph, Text } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { cn } from '@utils/cn';
import { formatNewsDate } from '@utils/news';
import type { NewsEntry } from 'types/news';

/**
 * Props accepted by the {@link NewsEntryItem} component.
 */
type NewsEntryItemProps = {
  /**
   * The entry to render.
   */
  entry: NewsEntry;
};

/**
 * Renders a single news entry: its type icon, the related game's logo and
 * name (when `gameId` is set), its description, and its date.
 *
 * @param props The entry to render.
 * @returns A single news feed row.
 */
export function NewsEntryItem({ entry }: NewsEntryItemProps) {
  const gameInfo = entry.gameId
    ? gameInfos[entry.gameId as keyof typeof gameInfos]
    : undefined;

  return (
    <div className="flex gap-3 border-b border-border py-3 last:border-b-0">
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          !gameInfo && 'bg-primary-soft',
        )}
        style={
          gameInfo
            ? { backgroundColor: gameInfo.color, color: 'white' }
            : undefined
        }
      >
        {gameInfo ? (
          <GameLogos
            gameId={gameInfo.id}
            className="h-6 w-6"
          />
        ) : (
          <NewsIcon
            type={entry.type}
            className={cn('h-6 w-6 text-primary')}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        {gameInfo && (
          <span className="text-sm font-semibold text-foreground">
            <DualTranslate>{gameInfo.name}</DualTranslate>
          </span>
        )}
        <Paragraph className="mb-0 text-sm text-foreground/80">
          {entry.description}
        </Paragraph>
        <Text
          type="secondary"
          className="text-xs"
        >
          {formatNewsDate(entry.date)}
        </Text>
      </div>
    </div>
  );
}
