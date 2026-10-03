import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { FILMACO_HEARTS } from '../utils/constants';
import { buildShareText } from '../utils/helpers';

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

      <Hearts
        remaining={hearts}
        total={FILMACO_HEARTS}
        emptyClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center"
        >
          {solvedLetters} de {totalLetters} caracteres descobertos
        </Text>

        <Divider orientation="vertical" />
        <Score value={score} />
      </div>
    </GameResultsSplash>
  );
}
