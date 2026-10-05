import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import type { DailyQuartetosSet } from 'types/games';
import { QUARTETOS_LEVEL_COLOR_CLASSES } from '../utils/constants';
import { buildShare } from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved all four quartets.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Total score accumulated during the run.
   */
  score: number;
  /**
   * Number of guesses submitted during the run.
   */
  guessesCount: number;
  /**
   * Sequential challenge number shown to the player.
   */
  challengeNumber: number;
  /**
   * The four quartets hidden in today's board.
   */
  sets: DailyQuartetosSet[];
  /**
   * Normalized keys for each submitted guess.
   */
  guesses: string[];
  /**
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Quartetos results splash shown after a win or loss: it recaps
 * today's hidden quartet themes, the player's remaining hearts and score,
 * then offers to either return to the Hub or close the overlay.
 *
 * @param props Result state, quartet recap data, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  score,
  guessesCount,
  challengeNumber,
  sets,
  guesses,
  onClose,
}: ResultsSplashProps) {
  const share = buildShare({
    challengeNumber,
    hearts,
    guesses,
    sets,
    score,
  });

  return (
    <GameResultsSplash
      gameId="quartetos"
      title={win ? 'Parabéns!' : 'Que pena!'}
      share={share}
      onClose={onClose}
    >
      <Text className="text-center">
        {win
          ? 'Você encontrou todos os quartetos de hoje.'
          : 'Estes eram os quartetos escondidos no desafio de hoje. Amanhã tem outra rodada.'}
      </Text>

      <div className="grid w-full gap-2">
        {sets.map((quartetSet) => {
          const levelColors =
            QUARTETOS_LEVEL_COLOR_CLASSES[quartetSet.level] ??
            QUARTETOS_LEVEL_COLOR_CLASSES[0];

          return (
            <Surface
              key={quartetSet.id}
              className={cn('border px-2 py-2', levelColors.surface)}
            >
              <Title
                level={5}
                className="text-center"
              >
                {quartetSet.title}
              </Title>
            </Surface>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center"
        >
          {guessesCount} de {sets.length} caracteres descobertos
        </Text>

        <Divider orientation="vertical" />
        <Score value={score} />
      </div>
    </GameResultsSplash>
  );
}
