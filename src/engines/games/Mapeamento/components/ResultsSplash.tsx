import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { MAPEAMENTO_HEARTS } from '../utils/constants';
import { buildShare } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player won today's location challenge.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the run.
   */
  hearts: number;
  /**
   * Correct location answer for today's challenge.
   */
  location: string;
  /**
   * Final score stored for today's run.
   */
  score: number;
  /**
   * Number of clues that were visible by the end of the run.
   */
  revealedClues: number;
  /**
   * Total clues available for today's challenge.
   */
  totalClues: number;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
  /**
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Mapeamento results splash shown after a win or loss: recaps
 * the answer, the remaining hearts, and the guesses that led there.
 *
 * @param props Final result data and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  location,
  score,
  revealedClues,
  totalClues,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const share = buildShare({
    challengeNumber,
    hearts,
    score,
  });

  return (
    <GameResultsSplash
      gameId="mapeamento"
      title={win ? 'Parabéns!' : 'Que pena!'}
      share={share}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center text-lg"
      >
        {location}
      </Text>

      <Hearts
        remaining={hearts}
        total={MAPEAMENTO_HEARTS}
        emptyClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center"
        >
          {revealedClues} de {totalClues} pistas reveladas
        </Text>

        <Divider orientation="vertical" />
        <Score value={score} />
      </div>
    </GameResultsSplash>
  );
}
