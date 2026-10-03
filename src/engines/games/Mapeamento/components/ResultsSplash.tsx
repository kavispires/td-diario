import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { MAPEAMENTO_HEARTS } from '../utils/constants';
import { buildShareText } from '../utils/helpers';

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
   * Wrong guesses submitted before the game ended.
   */
  guesses: string[];
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
  guesses,
  score,
  revealedClues,
  totalClues,
  challengeNumber,
  onClose,
}: ResultsSplashProps) {
  const shareText = buildShareText({
    challengeNumber,
    hearts,
  });

  return (
    <GameResultsSplash
      gameId="mapeamento"
      title={win ? 'Parabéns!' : 'Que pena!'}
      shareText={shareText}
      onClose={onClose}
    >
      <span
        className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm ${
          win
            ? 'bg-gold text-foreground'
            : 'bg-white/70 text-foreground backdrop-blur-sm'
        }`}
      >
        {win ? 'Você encontrou o lugar' : 'Hoje não deu'}
      </span>

      <Surface className="bg-white/75 px-5 py-5 text-center backdrop-blur-sm">
        <Text type="secondary">A resposta de hoje era</Text>
        <div className="mt-2">
          <Title level={3}>{location}</Title>
        </div>
      </Surface>

      <Hearts
        remaining={hearts}
        total={MAPEAMENTO_HEARTS}
        emptyClassName="text-black"
      />

      <div className="grid w-full grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/70 px-3 py-3 text-center shadow-sm">
          <Text type="secondary">Pistas</Text>
          <div className="mt-1 text-lg font-semibold text-foreground">
            {revealedClues}/{totalClues}
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 px-3 py-3 text-center shadow-sm">
          <Text type="secondary">Erros</Text>
          <div className="mt-1 text-lg font-semibold text-foreground">
            {guesses.length}
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 px-3 py-3 text-center shadow-sm">
          <Text type="secondary">Pontos</Text>
          <div className="mt-1 text-lg font-semibold text-foreground">
            {score}
          </div>
        </div>
      </div>

      <Surface className="w-full bg-white/70 px-5 py-5 backdrop-blur-sm">
        <Title
          level={5}
          className="mb-3 text-center"
        >
          {guesses.length > 0 ? 'Tentativas anteriores' : 'Resumo perfeito'}
        </Title>

        {guesses.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {guesses.map((guess, index) => (
              <span
                key={`${guess}-${index}`}
                className="rounded-full bg-border px-3 py-1.5 text-sm font-medium text-foreground"
              >
                {guess.toUpperCase()}
              </span>
            ))}
          </div>
        ) : (
          <Text className="block text-center">
            Você acertou sem gastar nenhuma tentativa errada.
          </Text>
        )}
      </Surface>
    </GameResultsSplash>
  );
}
