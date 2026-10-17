import { Segmented } from '@components/ui/Segmented';
import { Text } from '@components/ui/Typography';
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
import { cn } from '@utils/cn';
import type { DailyTaNaCaraVariant } from 'types/games';
import { getSuspectImageId } from '../utils/helpers';

/**
 * Segmented option values mapped to each possible suspect answer.
 */
const ANSWER_OPTIONS = [
  { value: 'no', label: '👎', activeClassName: 'bg-destructive' },
  { value: 'blank', label: '▫️' },
  { value: 'yes', label: '👍', activeClassName: 'bg-success' },
];

/**
 * Maps a suspect answer to its {@link ANSWER_OPTIONS} segmented value.
 *
 * @param answer - Current suspect answer.
 * @returns The matching segmented option value.
 */
function getAnswerOption(answer: boolean | null): string {
  if (answer === true) {
    return 'yes';
  }

  return answer === false ? 'no' : 'blank';
}

/**
 * Maps a segmented option value back to a suspect answer.
 *
 * @param value - Segmented option value picked by the player.
 * @returns The matching suspect answer.
 */
function getAnswerFromOption(value: string): boolean | null {
  if (value === 'yes') {
    return true;
  }

  return value === 'no' ? false : null;
}

/**
 * Props accepted by the {@link SuspectChoiceCard} component.
 */
type SuspectChoiceCardProps = {
  /**
   * Id of the suspect being displayed.
   */
  suspectId: string;
  /**
   * Current visual style variant for the suspect portrait.
   */
  variant: DailyTaNaCaraVariant;
  /**
   * Display name resolved for the suspect.
   */
  name: string;
  /**
   * Current answer selected for this suspect, or `null` when left blank.
   */
  answer: boolean | null;
  /**
   * Called when the player chooses an answer for this suspect.
   */
  onAnswerChange: (answer: boolean | null) => void;
  /**
   * Portrait width, in pixels, computed to fit three cards per row.
   */
  width: number;
};

/**
 * Renders one Ta Na Cara suspect portrait plus the thumbs-up/neutral/
 * thumbs-down segmented control used to evaluate that person for the
 * current testimony.
 *
 * @param props Suspect identity, current answer, answer handler, and width.
 * @returns The rendered suspect card.
 */
export function SuspectChoiceCard({
  suspectId,
  variant,
  name,
  answer,
  onAnswerChange,
  width,
}: SuspectChoiceCardProps) {
  const { getUrl } = useTDBaseUrl('images');
  const imagePath = getSuspectImageId(suspectId, variant).replaceAll('-', '/');

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl bg-card shadow-sm ring-2 transition-colors',
        answer === true && 'ring-success',
        answer === false && 'ring-destructive',
        answer === null && 'ring-transparent',
      )}
      style={{ width }}
    >
      <div className="relative aspect-[2/3] bg-border">
        <img
          src={getUrl(`${imagePath}.jpg`)}
          alt={`Retrato de ${name}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-4">
          <Text className="line-clamp-2 text-sm font-semibold text-white">
            {name}
          </Text>
        </div>
      </div>

      <div className="p-1.5">
        <Segmented
          block
          size="compact"
          className="bg-transparent"
          value={getAnswerOption(answer)}
          onChange={(value) => onAnswerChange(getAnswerFromOption(value))}
          options={ANSWER_OPTIONS}
        />
      </div>
    </div>
  );
}
