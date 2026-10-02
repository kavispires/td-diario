import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const game = gameInfos.panico;
  const completionPercentage = getCompletionPercentage(
    farthestButtonIndex,
    totalButtons,
  );

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4 px-6"
      style={{ backgroundColor: withAlpha(game.color, 0.96) }}
    >
      <div className="h-16 w-16">
        <GameLogos
          gameId="panico"
          className="h-full w-full drop-shadow-sm"
        />
      </div>

      <Title
        level={2}
        className="text-center"
      >
        {win ? 'Parabéns!' : 'Cabum!'}
      </Title>

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
