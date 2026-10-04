import { useTDImageCardUrl } from '@hooks/useTDImageCardUrl';
import { cn } from '@utils/cn';
import { useState } from 'react';
import { getSuspectImageCardId } from '../utils/helpers';

/**
 * Props accepted by the {@link SuspectPortrait} component.
 */
type SuspectPortraitProps = {
  /**
   * Suspect id used to resolve the portrait image.
   */
  suspectId: string;
  /**
   * Accessible description for the portrait.
   */
  alt: string;
  /**
   * Additional classes merged with the portrait frame.
   */
  className?: string;
};

/**
 * Renders one Investigação suspect portrait using the TD image library,
 * falling back to a simple placeholder if the image fails to load.
 *
 * @param props Suspect id, accessible label, and optional styling classes.
 * @returns The rendered portrait frame.
 */
export function SuspectPortrait({
  suspectId,
  alt,
  className,
}: SuspectPortraitProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = useTDImageCardUrl(getSuspectImageCardId(suspectId));

  return (
    <div
      className={cn(
        'relative aspect-2/3 overflow-hidden rounded-lg bg-border',
        className,
      )}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center bg-border-strong px-3 text-center text-xs font-semibold text-muted-foreground">
          Sem foto
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
