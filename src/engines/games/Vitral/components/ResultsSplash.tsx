import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import type { DailyVitralEntry } from 'types/games';
import { VITRAL_TOTAL_HEARTS } from '../utils/constants';
import { buildShare, formatElapsedTime } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Today's Vitral payload, used for the title and piece count recap.
   */
  data: DailyVitralEntry;
  /**
   * Whether the player solved the puzzle.
   */
  win: boolean;
  /**
   * Hearts remaining when the game ended.
   */
  hearts: number;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
  /**
   * Final elapsed time, in seconds.
   */
  totalTime: number;
  /**
   * Final score shown in the recap.
   */
  score: number;
  /**
   * Number of pieces already sitting in their solved slot.
   */
  correctPieces: number;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen results splash shown when Vitral ends. It keeps the port's
 * recap focused on the finished puzzle without share or next-game extras.
 *
 * @param props Final puzzle outcome, recap stats, and dismiss handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  data,
  win,
  hearts,
  challengeNumber,
  totalTime,
  score,
  correctPieces,
  onClose,
}: ResultsSplashProps) {
  const share = buildShare({
    challengeNumber,
    hearts,
    timeElapsed: totalTime,
    score,
  });

  return (
    <GameResultsSplash
      gameId="vitral"
      title={win ? 'Vitral montado!' : 'O vitral ficou inacabado'}
      share={share}
      onClose={onClose}
    >
      <div className="flex w-full max-w-xs flex-col gap-2 text-center">
        <Text strong>
          {win ? 'Você montou o vitral de hoje:' : 'O vitral de hoje era:'}
        </Text>

        <Text strong>"{data.title}"</Text>
      </div>

      <Hearts
        remaining={hearts}
        total={VITRAL_TOTAL_HEARTS}
        emptyClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {win
            ? `${data.pieces.length} de ${data.pieces.length} peças encaixadas em ${formatElapsedTime(totalTime)}`
            : `${correctPieces} de ${data.pieces.length} peças encaixadas em ${formatElapsedTime(totalTime)}`}
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
