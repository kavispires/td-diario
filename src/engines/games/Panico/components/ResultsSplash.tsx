import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { PANICO_TOTAL_HEARTS } from '../utils/constants';
import { buildShareText, getCompletionPercentage } from '../utils/helpers';

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
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
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
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const completionPercentage = getCompletionPercentage(
    farthestButtonIndex,
    totalButtons,
  );
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    percentage: completionPercentage,
  });
  const completedButtons = Math.max(farthestButtonIndex, 0);
  const remainingButtons = Math.max(totalButtons - completedButtons, 0);

  return (
    <GameResultsSplash
      gameId="panico"
      title={win ? 'Parabéns!' : 'Cabum!'}
      shareText={shareText}
      onClose={onClose}
    >
      <div className="flex w-full max-w-xs flex-col gap-4 text-center">
        <Text strong>
          {win
            ? 'Você completou toda a sequência de hoje.'
            : 'Você resistiu até esta parte da sequência:'}
        </Text>

        <Text className="text-lg text-black">
          Botão {completedButtons} de {totalButtons}
        </Text>
      </div>

      <div className="rounded-3xl bg-slate-950/25 px-5 py-4 text-center shadow-inner">
        <Text className="block text-sm text-slate-100/80">
          {completionPercentage}% da sequência vencida
        </Text>
        {!win && (
          <Text className="mt-2 block text-sm text-slate-100/80">
            Faltaram {remainingButtons} botões para concluir o desafio.
          </Text>
        )}
      </div>

      <Hearts
        remaining={hearts}
        total={PANICO_TOTAL_HEARTS}
        emptyClassName="text-black"
        filledClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {completedButtons} de {totalButtons} botões superados
        </Text>

        <Divider orientation="vertical" />
        <Score
          value={score}
          className="text-black"
        />
      </div>
    </GameResultsSplash>
  );
}
