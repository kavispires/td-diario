import { IconButton } from '@components/ui/IconButton';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import type { DailyPirralhosKidEntry } from 'types/games';
import { ASSESSMENT_META, type KidProfile } from '../utils/constants';
import type { KidAssessment } from '../utils/types';
import { KidPortrait } from './KidPortrait';

/**
 * Props accepted by the {@link KidCard} component.
 */
type KidCardProps = {
  /**
   * Daily statement entry for the visible kid.
   */
  kidEntry: DailyPirralhosKidEntry;
  /**
   * Static profile data referenced by the entry's `kidId`.
   */
  kid: KidProfile;
  /**
   * Zero-based index used only to label each card accessibly.
   */
  index: number;
  /**
   * Portrait width, in pixels.
   */
  width: number;
  /**
   * Current note marker assigned by the player.
   */
  assessment: KidAssessment;
  /**
   * Cycles the note marker for this kid.
   */
  onAssess: (kidId: string) => void;
  /**
   * Opens the accusation picker when the statement area is pressed.
   */
  onOpenSolve?: () => void;
};

/**
 * Renders one kid around the Pirralhos circle: portrait, clue badges,
 * note-marker cycle button, and tap target to open the accusation picker.
 *
 * @param props Kid data, current assessment, and interaction handlers.
 * @returns The rendered kid card.
 */
export function KidCard({
  kidEntry,
  kid,
  index,
  width,
  assessment,
  onAssess,
  onOpenSolve,
}: KidCardProps) {
  const assessmentMeta = ASSESSMENT_META[assessment];
  const AssessmentIcon = assessmentMeta.icon;

  return (
    <div
      className="flex flex-col items-center gap-2 rounded-[1.75rem] bg-card/95 px-2 py-3 text-center shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
      style={{ width: width + 20 }}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div
          className="rounded-full px-2 py-1 text-xs font-semibold text-foreground shadow-sm"
          style={{ backgroundColor: `${kid.color}22` }}
        >
          {kid.height} cm
        </div>

        <IconButton
          size="small"
          shape="circle"
          variant="outlined"
          aria-label={`Criança ${index + 1}, ${kid.name.pt}, ${assessmentMeta.ariaLabel}. Alternar marcação.`}
          icon={<AssessmentIcon />}
          onClick={() => onAssess(kid.id)}
        />
      </div>

      <KidPortrait
        kid={kid}
        width={width}
      />

      <div
        className={cn(
          'rounded-full px-2.5 py-1 text-[11px] font-semibold',
          assessmentMeta.classes,
        )}
      >
        {assessmentMeta.label}
      </div>

      <button
        type="button"
        onClick={onOpenSolve}
        className={cn(
          'flex w-full flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          onOpenSolve ? 'hover:bg-primary-soft/60' : 'cursor-default',
        )}
        aria-label={`Depoimento de ${kid.name.pt}`}
      >
        <Text
          strong
          className="text-center text-sm"
        >
          {kid.name.pt}
        </Text>
        <Text className="text-center text-xs leading-relaxed text-subtle-foreground">
          “{kidEntry.statement.pt}”
        </Text>
      </button>
    </div>
  );
}
