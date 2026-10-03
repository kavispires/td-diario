import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text } from '@components/ui/Typography';
import { getCompletionPercentage, PANICO_TOTAL_HEARTS } from '../utils/helpers';

/**
 * Props accepted by {@link ResultsSplash}.
 */
type ResultsSplashProps = {
  /**
   * Whether the player completed the full sequence.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Highest completed button count reached by the player.
   */
  farthestButtonIndex: number;
  /**
   * Total buttons in today's sequence.
   */
  totalButtons: number;
  /**
   * Current accumulated score.
   */
  score: number;
  /**
   * Called to dismiss the splash and keep looking at the game screen.
   */
  onClose: () => void;
};

/**
 * Fullscreen Panico results overlay shown after a win or loss.
 *
 * @param props End-state recap and dismissal actions.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  farthestButtonIndex,
  totalButtons,
  score,
  onClose,
}: ResultsSplashProps) {
  const completionPercentage = getCompletionPercentage(
    farthestButtonIndex,
    totalButtons,
  );

  return (
    <GameResultsSplash
      gameId="panico"
      title={win ? 'Parabéns!' : 'Cabum!'}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center text-lg"
      >
        {completionPercentage}% da sequência vencida
      </Text>

      <div className="rounded-3xl bg-slate-950/25 px-5 py-4 text-center shadow-inner">
        <Text className="block text-sm text-slate-100/80">
          Você foi até o botão {farthestButtonIndex} de {totalButtons}
        </Text>
        <Text className="mt-2 block text-sm text-slate-100/80">
          Pontuação: <strong>{score}</strong>
        </Text>
        <Text className="mt-2 block text-sm text-slate-100/80">
          Corações restantes: <strong>{hearts}</strong> de {PANICO_TOTAL_HEARTS}
        </Text>
      </div>
    </GameResultsSplash>
  );
}
