import { Hearts } from '@components/games/Hearts';
import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DailyConjuntosEntry } from 'types/games';
import { ThingCard } from './ThingCard';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Today's Conjuntos payload.
   */
  data: DailyConjuntosEntry;
  /**
   * Whether the puzzle ended in a win state.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the puzzle.
   */
  hearts: number;
  /**
   * Maximum hearts available at the start of the puzzle.
   */
  maxHearts: number;
  /**
   * Number of points accumulated from correct placements.
   */
  score: number;
  /**
   * Placement attempts recorded during play.
   */
  guesses: Array<{
    /**
     * Id of the thing that was being placed.
     */
    thingId: string;
    /**
     * Final result of the placement attempt.
     */
    result: 0 | 1 | 2 | false;
  }>;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen Conjuntos results splash shown after the puzzle ends: it
 * reveals the hidden rules, summarizes accuracy and score, and offers to
 * either return to the Hub or close the overlay.
 *
 * @param props Final puzzle outcome, recap data, and close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  data,
  win,
  hearts,
  maxHearts,
  score,
  guesses,
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const gameInfo = gameInfos.conjuntos;

  const thingNamesById = useMemo(
    () =>
      Object.fromEntries(
        [
          data.rule1.thing,
          data.rule2.thing,
          data.intersectingThing,
          ...data.things,
        ].map((thing) => [thing.id, thing.name] as const),
      ),
    [data],
  );
  const correctGuesses = guesses.filter(
    (guess) => guess.result !== false,
  ).length;

  return (
    <div
      className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.85) }}
      role="dialog"
      aria-modal="true"
      aria-label="Resultado de Conjuntos"
    >
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center gap-4">
        <div className="h-16 w-16">
          <GameLogos
            gameId="conjuntos"
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
          className="text-center uppercase tracking-wide"
        >
          {data.title}
        </Text>

        <Hearts
          remaining={hearts}
          total={maxHearts}
        />

        <div
          className={`grid w-full gap-3 rounded-[2rem] px-4 py-4 shadow-sm ${
            win ? 'bg-gold-soft' : 'bg-white/75'
          }`}
        >
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/60 px-3 py-3">
              <Text strong>{correctGuesses}</Text>
              <br />
              <Text
                type="secondary"
                className="text-sm"
              >
                acertos
              </Text>
            </div>
            <div className="rounded-2xl bg-white/60 px-3 py-3">
              <Text strong>{guesses.length}</Text>
              <br />
              <Text
                type="secondary"
                className="text-sm"
              >
                tentativas
              </Text>
            </div>
            <div className="rounded-2xl bg-white/60 px-3 py-3">
              <Text strong>{score}</Text>
              <br />
              <Text
                type="secondary"
                className="text-sm"
              >
                pontos
              </Text>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-[#fbb03b]/25 px-4 py-4">
              <Text strong>Círculo amarelo</Text>
              <Text className="mt-1 block">{data.rule1.text}</Text>
              <div className="mt-3">
                <ThingCard
                  itemId={data.rule1.thing.id}
                  name={data.rule1.thing.name}
                  width={58}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[#f15a24]/20 px-4 py-4">
              <Text strong>Círculo vermelho</Text>
              <Text className="mt-1 block">{data.rule2.text}</Text>
              <div className="mt-3">
                <ThingCard
                  itemId={data.rule2.thing.id}
                  name={data.rule2.thing.name}
                  width={58}
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white/60 px-4 py-4">
            <Text strong>Resumo das jogadas</Text>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {guesses.map((guess, index) => (
                <span
                  key={`${guess.thingId}-${index}`}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                    guess.result === false
                      ? 'bg-destructive/15 text-destructive'
                      : guess.result === 0
                        ? 'bg-orange-200 text-orange-900'
                        : guess.result === 1
                          ? 'bg-[#fbb03b]/35 text-orange-950'
                          : 'bg-[#f15a24]/25 text-orange-950'
                  }`}
                >
                  {thingNamesById[guess.thingId] ?? `Jogada ${index + 1}`}
                </span>
              ))}
            </div>
          </div>
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
