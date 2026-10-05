import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import type { DailyConjuntosEntry } from 'types/games';
import {
  CONJUNTOS_AREA_BACKGROUND_CLASSES,
  CONJUNTOS_RESULTS_RULE_THING_WIDTH,
  CONJUNTOS_RULE1_AREA,
  CONJUNTOS_RULE2_AREA,
} from '../utils/constants';
import { buildShare } from '../utils/helpers';
import type { Guess } from '../utils/types';
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
  guesses: Guess[];
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
  /**
   * Today's sequential challenge number, used in the shareable result.
   */
  challengeNumber: number;
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
  challengeNumber,
}: ResultsSplashProps) {
  const share = buildShare({
    challengeNumber,
    hearts,
    totalHearts: maxHearts,
    guesses,
    score,
  });

  return (
    <GameResultsSplash
      gameId="conjuntos"
      title={win ? 'Parabéns!' : 'Que pena!'}
      share={share}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center text-lg"
      >
        {data.title}
      </Text>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={cn(
            'grid gap-0 rounded-3xl px-4 py-4',
            CONJUNTOS_AREA_BACKGROUND_CLASSES[CONJUNTOS_RULE1_AREA],
          )}
        >
          <Text
            strong
            className="text-center block"
          >
            Círculo amarelo
          </Text>
          <Text className="text-center block italic">{data.rule1.text}</Text>
          <div>
            <ThingCard
              itemId={data.rule1.thing.id}
              name={data.rule1.thing.name}
              width={CONJUNTOS_RESULTS_RULE_THING_WIDTH}
            />
          </div>
        </div>

        <div
          className={cn(
            'grid gap-0 rounded-3xl px-4 py-4',
            CONJUNTOS_AREA_BACKGROUND_CLASSES[CONJUNTOS_RULE2_AREA],
          )}
        >
          <Text
            strong
            className="text-center block"
          >
            Círculo vermelho
          </Text>
          <Text className="text-center block italic">{data.rule2.text}</Text>
          <div className="mt-3">
            <ThingCard
              itemId={data.rule2.thing.id}
              name={data.rule2.thing.name}
              width={CONJUNTOS_RESULTS_RULE_THING_WIDTH}
            />
          </div>
        </div>
      </div>

      <Hearts
        remaining={hearts}
        total={maxHearts}
        emptyClassName="text-black"
      />

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center"
        >
          {guesses.length} tentativas
        </Text>

        <Divider orientation="vertical" />
        <Score value={score} />
      </div>
    </GameResultsSplash>
  );
}
