import { DailyItem } from '@components/games/DailyItem';
import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { buildShareText, FILMACO_HEARTS } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player guessed the movie before running out of hearts.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Secret movie title revealed in the results splash.
   */
  title: string;
  /**
   * Release year shown alongside the clue summary.
   */
  year: number | string;
  /**
   * Whether today's puzzle references a double feature instead of a single
   * movie release.
   */
  isDoubleFeature?: boolean;
  /**
   * Ids of the item clues shown during the puzzle.
   */
  itemsIds: string[];
  /**
   * Number of unique letters/digits the player discovered.
   */
  solvedLetters: number;
  /**
   * Total number of unique letters/digits in the title.
   */
  totalLetters: number;
  /**
   * Hearts-weighted score accumulated from correct guesses.
   */
  score: number;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen, game-colored splash shown when Filmaco ends in a win or
 * loss: it reveals the movie, recaps clue icons and solved-letter progress,
 * then offers to head back to the Hub or keep looking at the finished game.
 *
 * @param props Result state, recap data, and close handler.
 * @returns The rendered Filmaco results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  title,
  year,
  isDoubleFeature,
  itemsIds,
  solvedLetters,
  totalLetters,
  score,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    solvedLetters,
    totalLetters,
  });

  return (
    <GameResultsSplash
      gameId="filmaco"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center text-lg"
      >
        {title}
      </Text>

      <Text
        type="secondary"
        className="text-center"
      >
        {isDoubleFeature ? `Sessão Dupla · ${year}` : `Lançamento · ${year}`}
      </Text>

      <Hearts
        remaining={hearts}
        total={FILMACO_HEARTS}
        emptyClassName="text-black"
      />

      <Surface className="flex w-full flex-wrap justify-center gap-3 bg-white/70 px-4 py-4">
        {itemsIds.map((itemId, index) => (
          <DailyItem
            key={`${itemId}-${index}`}
            itemId={itemId}
            width={56}
          />
        ))}
      </Surface>

      <Text
        type="secondary"
        className="text-center"
      >
        {solvedLetters} de {totalLetters} letras e números descobertos
      </Text>

      <Text
        type="secondary"
        className="text-center"
      >
        Pontuação final: {score}
      </Text>
    </GameResultsSplash>
  );
}
