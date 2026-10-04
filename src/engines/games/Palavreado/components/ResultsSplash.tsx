import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { PALAVREADO_BASE_HEARTS, WORD_TONE_CLASSES } from '../utils/constants';
import { buildShareText } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved every row.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Correct row words for today's challenge.
   */
  words: string[];
  /**
   * Submitted row words, one matrix per attempt.
   */
  guesses: string[][];
  /**
   * Number of swaps made during the run.
   */
  swaps: number;
  /**
   * Final score achieved for the day.
   */
  score: number;
  /**
   * Whether the one-time smart shuffle hint was used.
   */
  usedSmartShuffle: boolean;
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
 * Fullscreen Palavreado results splash shown after a win or loss, recapping
 * the answer words and final stats.
 *
 * @param props - Result state, recap stats, and dismiss handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  words,
  guesses,
  swaps,
  score,
  usedSmartShuffle,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
    swaps,
    guesses,
    words,
    usedSmartShuffle,
    score,
  });

  return (
    <GameResultsSplash
      gameId="palavreado"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <div className="flex w-full max-w-xs flex-col gap-4  text-center">
        <Text strong>
          {win
            ? 'Você reorganizou todas as palavras.'
            : 'As palavras de hoje eram estas:'}
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {words.map((word, index) => (
            <span
              key={`${index}-${word}`}
              className={cn(
                'rounded-md px-3 py-1 font-mono text-sm font-semibold uppercase tracking-wide',
                WORD_TONE_CLASSES[index] ??
                  WORD_TONE_CLASSES[WORD_TONE_CLASSES.length - 1],
              )}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <Hearts
        remaining={hearts}
        total={PALAVREADO_BASE_HEARTS}
        emptyClassName="text-black"
        filledClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {0} de {words.length} caracteres descobertos
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
