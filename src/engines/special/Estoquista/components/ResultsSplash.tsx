import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text } from '@components/ui/Typography';
import { buildShareText } from '../utils/helpers';

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
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
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
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    totalHearts,
    evaluations,
  });

  return (
    <GameResultsSplash
      gameId="estoquista"
      title={win ? 'Expedição perfeita!' : 'O estoque te venceu hoje'}
      shareText={shareText}
      onClose={onClose}
    >
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
    </GameResultsSplash>
  );
}
