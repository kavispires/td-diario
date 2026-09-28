import { DailyItem } from '@components/games/DailyItem';
import { Hearts } from '@components/games/Hearts';
import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';
import { ORGANIKU_HEARTS } from '../utils/helpers';

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
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const gameInfo = gameInfos.organiku;

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 px-6"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.95) }}
    >
      <div className="w-16 h-16">
        <GameLogos
          gameId="organiku"
          className="w-full h-full drop-shadow-sm"
        />
      </div>

      <Title
        level={2}
        className="text-center text-foreground"
      >
        {win ? 'Parabéns!' : 'Que pena!'}
      </Title>

      <Text
        strong
        className="text-center"
      >
        "{title}"
      </Text>

      <Hearts
        remaining={hearts}
        total={ORGANIKU_HEARTS}
      />

      <div className="flex items-center justify-center gap-2">
        {itemsIds.map((itemId) => {
          const isFound = foundCount[itemId] === gridSize;
          return (
            <DailyItem
              key={itemId}
              itemId={isFound ? itemId : '0'}
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
        {flips} de {swapLimit} viradas
      </Text>

      <div className="flex w-full max-w-xs flex-col gap-3 pt-2">
        <Button
          variant="chrome"
          block
          onClick={() => navigate('/')}
        >
          Voltar ao Hub
        </Button>
        <Button
          variant="outlined"
          block
          className="!border-white !text-white hover:!bg-white/10"
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}
