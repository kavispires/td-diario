import { DailyItem } from '@components/games/DailyItem';
import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Text } from '@components/ui/Typography';
import { ORGANIKU_PLACEHOLDER_ITEM_ID } from '../utils/constants';
import { buildShareText } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player won (found every pair before running out of hearts).
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Ids of the distinct items placed in the grid.
   */
  itemsIds: string[];
  /**
   * Title describing the theme of today's grid.
   */
  title: string;
  /**
   * Count of revealed tiles per item id.
   */
  foundCount: Dictionary<number>;
  /**
   * The grid's side length, used to detect a fully-found item.
   */
  gridSize: number;
  /**
   * Number of tile flips made.
   */
  flips: number;
  /**
   * Total tile flips available before running out of pairs to try.
   */
  swapLimit: number;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
  /**
   * Called to dismiss the splash and return to viewing the completed grid.
   */
  onClose: () => void;
};

/**
 * Fullscreen, game-colored splash shown when Organiku ends in a win or
 * loss: recaps which items were fully found, then offers to keep looking
 * at the board or head back to the Hub.
 *
 * @param props Result state, recap data, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  itemsIds,
  title,
  foundCount,
  gridSize,
  flips,
  swapLimit,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    itemsIds,
    foundCount,
    gridSize,
    flips,
    swapLimit,
  });

  return (
    <GameResultsSplash
      gameId="organiku"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        "{title}"
      </Text>

      <Hearts
        remaining={hearts}
        total={itemsIds.length}
        emptyClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        {itemsIds.map((itemId) => {
          const isFound = foundCount[itemId] === gridSize;
          return (
            <DailyItem
              key={itemId}
              itemId={isFound ? itemId : ORGANIKU_PLACEHOLDER_ITEM_ID}
              width={45}
              className={isFound ? 'opacity-100' : 'opacity-30 grayscale'}
            />
          );
        })}
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        {flips} de {swapLimit} viradas projetadas
      </Text>
    </GameResultsSplash>
  );
}
