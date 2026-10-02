import { Hearts } from '@components/games/Hearts';
import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';
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
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const gameInfo = gameInfos['arte-ruim'];

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.85) }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <GameLogos
            gameId="arte-ruim"
            className="h-full w-full drop-shadow-sm"
          />
        </div>

        <Title
          level={2}
          className="text-center"
        >
          {win ? 'Parabéns!' : 'Que pena!'}
        </Title>

        <div
          className={`w-full rounded-[2rem] px-5 py-4 text-center shadow-sm ${
            win ? 'bg-gold-soft' : 'bg-white/75'
          }`}
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
        </div>

        <Hearts
          remaining={hearts}
          total={3}
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

        <div className="flex w-full flex-col gap-3 pt-2">
          <Button
            variant="primary"
            size="small"
            block
            onClick={() => navigate('/')}
          >
            Voltar ao Hub
          </Button>
          <Button
            variant="outlined"
            size="small"
            block
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
