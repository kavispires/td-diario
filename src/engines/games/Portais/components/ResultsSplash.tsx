import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import type { DailyPortaisCorridor } from 'types/games';
import { DEFAULT_HEARTS } from '../utils/constants';
import { buildShareText, getTotalMoves } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved every corridor before running out of hearts.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the run.
   */
  hearts: number;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
  /**
   * Corridors that made up today's challenge.
   */
  corridors: DailyPortaisCorridor[];
  /**
   * Index of the corridor the engine was on when the run ended.
   */
  currentCorridorIndex: number;
  /**
   * Move count tracked for each corridor.
   */
  moves: number[];
  /**
   * Submitted guesses grouped by corridor, in submission order.
   */
  guesses: string[][];
  /**
   * Suggested move target for the whole run.
   */
  goal: number;
  /**
   * Final score accumulated across solved corridors.
   */
  score: number;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen Portais results splash shown after the game ends: recaps
 * which corridors were cleared, surfaces the final move count and score,
 * and offers to either return to the Hub or close the overlay.
 *
 * @param props Result state, recap data, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  challengeNumber,
  corridors,
  currentCorridorIndex,
  moves,
  guesses,
  goal,
  score,
  onClose,
}: ResultsSplashProps) {
  const totalMoves = getTotalMoves(moves);
  const solvedCorridors = win ? corridors.length : currentCorridorIndex;
  const shareText = buildShareText({
    challengeNumber,
    guesses,
    win,
    hearts,
    moves,
    goal,
  });

  return (
    <GameResultsSplash
      gameId="portais"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <div className="flex w-full max-w-xs flex-col gap-4 text-center">
        <Text strong>
          {win
            ? 'Você atravessou todos os portais do dia.'
            : 'As palavras-chave de hoje eram estas:'}
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {corridors.map((corridor, index) => (
            <span
              key={`${index}-${corridor.passcode}`}
              className={`rounded-full px-3 py-1 text-sm font-semibold uppercase ${
                index < solvedCorridors
                  ? 'bg-gold-soft text-foreground'
                  : 'bg-white/75 text-subtle-foreground'
              }`}
            >
              {corridor.passcode}
            </span>
          ))}
        </div>
      </div>

      <Hearts
        remaining={hearts}
        total={DEFAULT_HEARTS}
        emptyClassName="text-black"
        filledClassName="text-black"
      />

      <div className="grid w-full gap-3">
        {corridors.map((corridor, index) => {
          const solved = index < solvedCorridors;

          return (
            <div
              key={corridor.passcode}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1.75rem] bg-white/75 px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <Text
                  strong
                  className="block text-sm text-subtle-foreground"
                >
                  Corredor {index + 1}
                </Text>
                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-sm font-semibold uppercase ${
                    solved
                      ? 'bg-gold-soft text-foreground'
                      : 'bg-surface-raised text-subtle-foreground'
                  }`}
                >
                  {corridor.passcode}
                </span>
              </div>

              <div className="text-right">
                <Text
                  strong
                  className="block"
                >
                  {moves[index] ?? 0} mov.
                </Text>
                <Text
                  type="secondary"
                  className="text-xs"
                >
                  {solved ? 'Acertou' : 'Não concluiu'}
                </Text>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {solvedCorridors} de {corridors.length} corredores concluídos em{' '}
          {totalMoves} mov.
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
