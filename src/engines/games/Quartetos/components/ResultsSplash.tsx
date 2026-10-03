import { DailyItem } from '@components/games/DailyItem';
import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text, Title } from '@components/ui/Typography';
import type { DailyQuartetosSet } from 'types/games';

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
  onClose,
}: ResultsSplashProps) {
  return (
    <GameResultsSplash
      gameId="quartetos"
      title={win ? 'Parabéns!' : 'Que pena!'}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        Desafio #{challengeNumber}
      </Text>

      <div className="grid w-full grid-cols-3 gap-3">
        <div className="rounded-3xl bg-white/70 px-4 py-3 text-center shadow-sm">
          <Text
            strong
            className="block text-sm"
          >
            Corações
          </Text>
          <Text className="text-sm">{hearts}</Text>
        </div>

        <div className="rounded-3xl bg-gold-soft px-4 py-3 text-center shadow-sm">
          <Text
            strong
            className="block text-sm"
          >
            Pontos
          </Text>
          <Text className="text-sm">{score}</Text>
        </div>

        <div className="rounded-3xl bg-white/70 px-4 py-3 text-center shadow-sm">
          <Text
            strong
            className="block text-sm"
          >
            Tentativas
          </Text>
          <Text className="text-sm">{guessesCount}</Text>
        </div>
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        {win
          ? 'Você encontrou todos os quartetos de hoje.'
          : 'Estes eram os quartetos escondidos no desafio de hoje. Amanhã tem outra rodada.'}
      </Text>

      <div className="grid w-full gap-3">
        {sets.map((quartetSet) => (
          <div
            key={quartetSet.id}
            className="rounded-[2rem] border border-gold/40 bg-gold-soft px-4 py-4 shadow-sm"
          >
            <Title
              level={5}
              className="text-center"
            >
              {quartetSet.title}
            </Title>

            <div className="mt-3 grid grid-cols-4 justify-items-center gap-2">
              {quartetSet.itemsIds.map((itemId) => (
                <div
                  key={itemId}
                  className="flex items-center justify-center rounded-2xl bg-white/55 p-1"
                >
                  <DailyItem
                    itemId={itemId}
                    width={56}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GameResultsSplash>
  );
}
