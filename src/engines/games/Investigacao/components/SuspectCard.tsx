import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { Search, Siren } from 'lucide-react';
import { motion } from 'motion/react';
import type { DailyInvestigacaoSuspect } from 'types/games';
import {
  SUSPECT_CARD_ANIMATION_DURATION_SECONDS,
  SUSPECT_CARD_ANIMATION_Y_OFFSET,
} from '../utils/constants';
import { SuspectPortrait } from './SuspectPortrait';

/**
 * Props accepted by the {@link SuspectCard} component.
 */
type SuspectCardProps = {
  /**
   * Suspect to render.
   */
  suspect: DailyInvestigacaoSuspect;
  /**
   * Width applied to the card.
   */
  cardWidth: number;
  /**
   * Whether the suspect has already been released.
   */
  isReleased: boolean;
  /**
   * Zero-based release order, or `-1` when still active.
   */
  releaseOrder: number;
  /**
   * Whether the suspect is currently selected for confirmation.
   */
  isActive: boolean;
  /**
   * Whether the suspect is the culprit after the puzzle is complete.
   */
  isCulprit: boolean;
  /**
   * Whether the card should ignore clicks.
   */
  disabled: boolean;
  /**
   * Stagger delay for the entry animation.
   */
  animationDelay: number;
  /**
   * Called when the suspect is selected.
   */
  onSelect: () => void;
};

/**
 * Renders one selectable Investigação suspect card with portrait, status
 * badges, and release state styling.
 *
 * @param props Suspect data, visual state, and selection handler.
 * @returns The rendered suspect card.
 */
export function SuspectCard({
  suspect,
  cardWidth,
  isReleased,
  releaseOrder,
  isActive,
  isCulprit,
  disabled,
  animationDelay,
  onSelect,
}: SuspectCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: SUSPECT_CARD_ANIMATION_Y_OFFSET }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: SUSPECT_CARD_ANIMATION_DURATION_SECONDS,
        ease: 'easeOut',
        delay: animationDelay,
      }}
      disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      aria-label={
        isReleased
          ? `${suspect.name.pt} já foi liberado`
          : `Liberar ${suspect.name.pt}`
      }
      className={cn(
        'relative flex flex-col gap-0 rounded-lg bg-surface-raised p-1 text-left shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default',
        isActive && 'ring-2 ring-primary',
        isReleased && 'bg-border/60 text-muted-foreground',
        isCulprit && 'bg-gold-soft ring-2 ring-gold',
      )}
      style={{ width: cardWidth }}
    >
      <SuspectPortrait
        suspectId={suspect.id}
        alt={`Retrato de ${suspect.name.pt}`}
        className={cn(isReleased && !isCulprit && 'grayscale opacity-55')}
      />

      <div className="flex min-h-6 flex-col justify-center text-center">
        <Text
          strong
          className="line-clamp-2 text-sm"
        >
          {suspect.name.pt}
        </Text>
        {!isReleased ? (
          <Search
            className="h-2 w-2 mx-auto"
            aria-hidden="true"
          />
        ) : (
          <Text
            type="secondary"
            className="text-xs"
          >
            {isCulprit ? 'Culpado' : `Liberado #${releaseOrder + 1}`}
          </Text>
        )}
      </div>

      {isCulprit && (
        <span className="absolute bottom-1 right-[-50%] transform -translate-x-1/2 flex items-center gap-1 rounded-full bg-gold px-2 py-1 text-[11px] font-semibold text-chrome shadow-sm">
          <Siren
            className="h-3.5 w-3.5"
            aria-hidden="true"
          />
          Culpado
        </span>
      )}
    </motion.button>
  );
}
