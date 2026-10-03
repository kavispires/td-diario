import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import type { DailyVitralEntry } from 'types/games';
import { buildShareText, formatElapsedTime } from '../utils/helpers';
import { VITRAL_TOTAL_HEARTS } from '../utils/puzzleUtils';

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
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    timeElapsed: totalTime,
    score,
  });

  return (
    <GameResultsSplash
      gameId="vitral"
      title={win ? 'Vitral montado!' : 'O vitral ficou inacabado'}
      shareText={shareText}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        "{data.title}"
      </Text>

      <Surface
        className={
          win
            ? 'w-full bg-gold-soft px-5 py-6 text-center'
            : 'w-full bg-white/70 px-5 py-6 text-center'
        }
      >
        <div className="grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <Text
              type="secondary"
              className="text-xs uppercase tracking-wide"
            >
              Peças certas
            </Text>
            <Text strong>{correctPieces}</Text>
          </div>

          <div className="flex flex-col gap-1">
            <Text
              type="secondary"
              className="text-xs uppercase tracking-wide"
            >
              Corações
            </Text>
            <Text strong>
              {hearts}/{VITRAL_TOTAL_HEARTS}
            </Text>
          </div>

          <div className="flex flex-col gap-1">
            <Text
              type="secondary"
              className="text-xs uppercase tracking-wide"
            >
              Tempo
            </Text>
            <Text strong>{formatElapsedTime(totalTime)}</Text>
          </div>

          <div className="flex flex-col gap-1">
            <Text
              type="secondary"
              className="text-xs uppercase tracking-wide"
            >
              Pontos
            </Text>
            <Text strong>{score}</Text>
          </div>
        </div>
      </Surface>

      <Text
        type="secondary"
        className="text-center"
      >
        {win
          ? `Você encaixou as ${data.pieces.length} peças antes que o tempo consumisse seus corações.`
          : `Você encaixou ${correctPieces} de ${data.pieces.length} peças antes de ficar sem corações.`}
      </Text>
    </GameResultsSplash>
  );
}
