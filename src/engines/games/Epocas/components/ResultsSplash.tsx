import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import type { DailyEpocasEvent } from 'types/games';
import {
  buildShare,
  formatHistoricalYear,
  getSortedIndexes,
} from '../utils/helpers';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved today's timeline.
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
   * How many events were correctly placed on each past verify attempt.
   */
  attempts: number[];
  /**
   * Sequential challenge number shown to the player.
   */
  challengeNumber: number;
  /**
   * Today's events, in their shuffled (original) order.
   */
  events: DailyEpocasEvent[];
  /**
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Épocas results splash shown after a win or loss: it reveals
 * the full chronological order with each event's real year, plus the
 * player's remaining hearts and score, then offers to either return to the
 * Hub or close the overlay.
 *
 * @param props Result state, today's events, and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  score,
  attempts,
  challengeNumber,
  events,
  onClose,
}: ResultsSplashProps) {
  const sortedIndexes = getSortedIndexes(events);
  const lastAttempt = attempts.at(-1) ?? 0;
  const share = buildShare({
    challengeNumber,
    hearts,
    attempts,
    totalEvents: events.length,
    score,
  });

  return (
    <GameResultsSplash
      gameId="epocas"
      title={win ? 'Parabéns!' : 'Que pena!'}
      share={share}
      onClose={onClose}
    >
      <Text className="text-center">
        {win
          ? 'Você colocou todos os eventos de hoje em ordem cronológica.'
          : 'Esta era a ordem cronológica correta de hoje. Amanhã tem outra rodada.'}
      </Text>

      <div className="flex w-full flex-col gap-2">
        {sortedIndexes.map((eventIndex, _position) => (
          <Surface
            key={eventIndex}
            className="flex items-center gap-3 bg-[#f4e8d5] px-3 py-2"
          >
            <Text
              strong
              className="w-16 shrink-0 text-sm"
            >
              {formatHistoricalYear(events[eventIndex].year)}
            </Text>
            <Text className="text-sm">{events[eventIndex].event}</Text>
          </Surface>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Text className="text-center">
          {lastAttempt} de {events.length} corretos na última tentativa
        </Text>

        <Divider orientation="vertical" />
        <Score value={score} />
      </div>

      <Text
        type="secondary"
        className="text-center text-sm"
      >
        {hearts} {hearts === 1 ? 'coração restante' : 'corações restantes'}
      </Text>
    </GameResultsSplash>
  );
}
