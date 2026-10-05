import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { ARTE_RUIM_HEARTS } from '../utils/constants';
import { buildShare } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved today's phrase.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Final score accumulated during the round.
   */
  score: number;
  /**
   * Final answer text for today's phrase.
   */
  answer: string;
  /**
   * Number of unique letters the player revealed.
   */
  revealedLetters: number;
  /**
   * Total number of unique letters in today's phrase.
   */
  totalLetters: number;
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
 * Fullscreen Arte Ruim results splash shown after a win or loss: it reveals
 * the phrase, recaps the final score, and lets the player either close the
 * overlay or return to the Hub.
 *
 * @param props Result state, recap data, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  score,
  answer,
  revealedLetters,
  totalLetters,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const share = buildShare({
    challengeNumber,
    hearts,
    revealedLetters,
    totalLetters,
    score,
  });

  return (
    <GameResultsSplash
      gameId="arte-ruim"
      title={win ? 'Parabéns!' : 'Que pena!'}
      share={share}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center text-lg"
      >
        "{answer}"
      </Text>

      <Hearts
        remaining={hearts}
        total={ARTE_RUIM_HEARTS}
        emptyClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center"
        >
          {revealedLetters} de {totalLetters} caracteres descobertos
        </Text>
        <Divider orientation="vertical" />
        <Score value={score} />
      </div>
    </GameResultsSplash>
  );
}
