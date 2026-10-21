import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';

/**
 * Props accepted by the {@link AttemptsHistory} component.
 */
type AttemptsHistoryProps = {
  /**
   * How many events were correctly placed on each past verify attempt, in
   * the order they were made.
   */
  attempts: number[];
  /**
   * Total number of events in today's timeline.
   */
  totalEvents: number;
};

/**
 * Picks a tone for an attempt row based on how close it got to a full
 * match, without ever revealing which specific events were wrong.
 *
 * @param correctCount - How many events were correctly placed.
 * @param totalEvents - Total number of events in today's timeline.
 * @returns Tailwind classes for the attempt row.
 */
function getAttemptTone(correctCount: number, totalEvents: number): string {
  if (correctCount === totalEvents) {
    return 'border-gold bg-gold-soft';
  }

  const ratio = correctCount / totalEvents;
  if (ratio >= 0.75) {
    return 'border-green-400/50 bg-green-100';
  }
  if (ratio >= 0.4) {
    return 'border-yellow-400/50 bg-yellow-100';
  }
  return 'border-orange-400/50 bg-orange-100';
}

/**
 * Renders Épocas' bottom attempt history: one row per past verify, each
 * showing only how many events were correctly placed out of the total,
 * never which ones.
 *
 * @param props Past attempts and the total number of events.
 * @returns The rendered history list, or `null` when there are no
 *   attempts yet.
 */
export function AttemptsHistory({
  attempts,
  totalEvents,
}: AttemptsHistoryProps) {
  if (attempts.length === 0) {
    return null;
  }

  return (
    <section className="flex w-full flex-col gap-2">
      <Text
        type="secondary"
        className="text-center text-sm"
      >
        Tentativas
      </Text>

      <div className="flex flex-col gap-2">
        {attempts.map((correctCount, attemptIndex) => (
          <div
            key={`${attemptIndex}-${correctCount}`}
            className={cn(
              'flex items-center justify-center rounded-2xl border px-3 py-2',
              getAttemptTone(correctCount, totalEvents),
            )}
          >
            <Text className="text-sm font-semibold">
              Tentativa {attemptIndex + 1}: {correctCount} de {totalEvents}{' '}
              corretos
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
}
