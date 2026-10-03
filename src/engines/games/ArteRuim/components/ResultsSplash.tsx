import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { buildShareText } from '../utils/helpers';
import { DrawingPreview } from './DrawingPreview';

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
   * Serialized drawing clues shown during the round.
   */
  drawings: string[];
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
  drawings,
  revealedLetters,
  totalLetters,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    revealedLetters,
    totalLetters,
  });

  return (
    <GameResultsSplash
      gameId="arte-ruim"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <Surface
        className={`w-full px-5 py-4 text-center ${win ? 'bg-gold-soft' : 'bg-white/75'}`}
      >
        <Text
          strong
          className="text-sm uppercase tracking-[0.2em]"
        >
          Resposta de hoje
        </Text>
        <Title
          level={4}
          className="mt-2 text-center"
        >
          {answer}
        </Title>
      </Surface>

      <Hearts
        remaining={hearts}
        total={3}
        emptyClassName="text-black"
      />

      <Text
        type="secondary"
        className="text-center"
      >
        Você revelou {revealedLetters} de {totalLetters} letras únicas e fez{' '}
        {score} pontos.
      </Text>

      <div className="grid w-full grid-cols-2 gap-3">
        {drawings.map((drawing, index) => (
          <DrawingPreview
            key={`${drawing}-${index}`}
            drawing={drawing}
            label={`Resumo do desenho ${index + 1}`}
            className="rounded-3xl"
          />
        ))}
      </div>
    </GameResultsSplash>
  );
}
