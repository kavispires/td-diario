import { DailyItem } from '@components/games/DailyItem';
import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const gameInfo = gameInfos.quartetos;

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.96) }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <GameLogos
            gameId="quartetos"
            className="h-full w-full drop-shadow-sm"
          />
        </div>

        <Title
          level={2}
          className="text-center"
        >
          {win ? 'Parabéns!' : 'Que pena!'}
        </Title>

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

        <div className="flex w-full flex-col gap-3 pt-2">
          <Button
            variant="primary"
            size="small"
            block
            onClick={() => navigate('/')}
          >
            Voltar ao Hub
          </Button>
          <Button
            variant="outlined"
            size="small"
            block
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
