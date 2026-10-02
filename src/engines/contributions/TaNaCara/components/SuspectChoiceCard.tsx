import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { useTDBaseUrl } from '@hooks/useTDBaseUrl';
import { cn } from '@utils/cn';
import type { DailyTaNaCaraVariant } from 'types/games';
import { getSuspectImageId } from '../utils/helpers';

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
   * Called when the player chooses `Sim` or `Não` for this suspect.
   */
  onAnswerChange: (answer: boolean) => void;
};

/**
 * Renders one Ta Na Cara suspect portrait plus the `Sim`/`Não` controls
 * used to evaluate that person for the current testimony.
 *
 * @param props Suspect identity, current answer, and answer handler.
 * @returns The rendered suspect card.
 */
export function SuspectChoiceCard({
  suspectId,
  variant,
  name,
  answer,
  onAnswerChange,
}: SuspectChoiceCardProps) {
  const { getUrl } = useTDBaseUrl('images');
  const imagePath = getSuspectImageId(suspectId, variant).replaceAll('-', '/');

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.75rem] bg-card shadow-sm ring-2 transition-colors',
        answer === true && 'ring-primary',
        answer === false && 'ring-secondary',
        answer === null && 'ring-transparent',
      )}
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

      <div className="grid gap-2 p-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={answer === true ? 'primary' : 'outlined'}
            size="small"
            block
            onClick={() => onAnswerChange(true)}
          >
            Sim
          </Button>
          <Button
            variant={answer === false ? 'secondary' : 'outlined'}
            size="small"
            block
            onClick={() => onAnswerChange(false)}
          >
            Não
          </Button>
        </div>

        <Text
          type="secondary"
          className="text-center text-xs"
        >
          {answer === null ? 'Em branco' : 'Toque de novo para limpar'}
        </Text>
      </div>
    </div>
  );
}
