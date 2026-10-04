import { DualTranslate } from '@components/ui/DualTranslate';
import { IconButton } from '@components/ui/IconButton';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import type { DailyPirralhosKidEntry } from 'types/games';
import { ASSESSMENT_META, type KidProfile } from '../utils/constants';
import type { KidAssessment } from '../utils/types';
import { KidPortrait } from './KidPortrait';
import { PirralhosIcon } from './PirralhosIcon';

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

  return (
    <div
      className="flex flex-col items-center gap-1 rounded-[1.25rem] bg-card/95 p-1.5 text-center shadow-lg ring-1 ring-black/5 backdrop-blur-sm"
      style={{ width }}
    >
      <div className="relative">
        <KidPortrait
          kid={kid}
          width={width - 12}
        />

        <div
          className="absolute -top-2 left-1 rounded-full px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm"
          style={{ backgroundColor: kid.color }}
        >
          <DualTranslate>{kid.name}</DualTranslate>
        </div>

        <IconButton
          size="large"
          shape="circle"
          // variant="outlined"
          className="absolute -top-3 -right-3 bg-white p-1 shadow-sm"
          aria-label={`Criança ${index + 1}, ${kid.name.pt}, ${assessmentMeta.ariaLabel}. Alternar marcação.`}
          icon={
            <PirralhosIcon
              icon={assessmentMeta.iconId}
              size={24}
            />
          }
          onClick={() => onAssess(kid.id)}
        />

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-chrome px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
          <PirralhosIcon
            icon={kid.gender === 'girl' ? 'female' : 'male'}
            size={14}
          />
          {kid.height}cm
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenSolve}
        className={cn(
          'relative -mt-4 flex w-full flex-col items-center gap-1 rounded-2xl bg-surface-raised px-2 py-1 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          onOpenSolve && 'hover:bg-primary-soft/60',
        )}
        aria-label={`Depoimento de ${kid.name.pt}`}
      >
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-surface-raised"
        />
        <Text className="relative text-center text-xs leading-relaxed text-subtle-foreground italic">
          <DualTranslate>{kidEntry.statement}</DualTranslate>
        </Text>
      </button>
    </div>
  );
}
