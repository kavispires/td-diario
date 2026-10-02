import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved every order correctly.
   */
  win: boolean;
  /**
   * Theme title shown for today's warehouse.
   */
  title: string;
  /**
   * Hearts remaining at the end of the game.
   */
  hearts: number;
  /**
   * Total hearts available at the start of the game.
   */
  totalHearts: number;
  /**
   * Per-attempt correctness rows aligned to the submitted orders.
   */
  evaluations: boolean[][];
  /**
   * Final score accumulated by the player.
   */
  score: number;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen, game-colored splash shown when Estoquista ends in a win or
 * loss, summarizing the run and offering either dismissal or a trip back to
 * the hub.
 *
 * @param props Result data and dismissal handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  title,
  hearts,
  totalHearts,
  evaluations,
  score,
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const gameInfo = gameInfos.estoquista;

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 px-6"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.95) }}
    >
      <div className="h-16 w-16">
        <GameLogos
          gameId="estoquista"
          className="h-full w-full drop-shadow-sm"
        />
      </div>

      <Title
        level={2}
        className="text-center text-foreground"
      >
        {win ? 'Expedição perfeita!' : 'O estoque te venceu hoje'}
      </Title>

      <Text
        strong
        className="text-center"
      >
        "{title}"
      </Text>

      <Text
        type="secondary"
        className="text-center"
      >
        {win
          ? `Você entregou tudo com ${hearts} de ${totalHearts} corações sobrando.`
          : `Você ficou sem corações depois de ${evaluations.length} envio${evaluations.length === 1 ? '' : 's'}.`}
      </Text>

      <div className="flex flex-col items-center gap-2 rounded-[2rem] bg-white/55 px-5 py-4 shadow-sm">
        <Text strong>Pontuação: {score}</Text>
        <div className="flex flex-wrap justify-center gap-2">
          {evaluations.map((attempt, index) => (
            <div
              key={`${attempt.join('-')}-${index}`}
              role="img"
              className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-2"
              aria-label={`Tentativa ${index + 1}: ${attempt.filter(Boolean).length} de ${attempt.length} pedidos corretos`}
            >
              {attempt.map((isCorrect, itemIndex) => (
                <span
                  key={`${index}-${itemIndex}`}
                  className={`h-3 w-3 rounded-full ${
                    isCorrect ? 'bg-gold' : 'bg-destructive'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3 pt-2">
        <Button
          variant="chrome"
          size="small"
          block
          onClick={() => navigate('/')}
        >
          Voltar ao Hub
        </Button>
        <Button
          variant="ghost"
          size="small"
          block
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
    </div>
  );
}
