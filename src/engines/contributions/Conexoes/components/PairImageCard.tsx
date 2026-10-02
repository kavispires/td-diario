import { useTDImageCardUrl } from '@hooks/useTDImageCardUrl';

/**
 * Props accepted by the {@link PairImageCard} component.
 */
type PairImageCardProps = {
  /**
   * Image id used to build the TD image-card URL.
   */
  imageId: string;
  /**
   * Accessible label describing this specific image.
   */
  label: string;
  /**
   * Width and height of the rendered card.
   */
  width: number;
  /**
   * Whether the image should be eagerly loaded.
   */
  priority?: boolean;
};

/**
 * Renders one TD image card inside Conexões' pair layout.
 *
 * @param props Image id, accessible label, desired size, and loading mode.
 * @returns The rendered image card.
 */
export function PairImageCard({
  imageId,
  label,
  width,
  priority = false,
}: PairImageCardProps) {
  const imageUrl = useTDImageCardUrl(imageId);

  return (
    <div
      className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-black/5"
      style={{ width, minWidth: width }}
    >
      <img
        src={imageUrl}
        alt={label}
        loading={priority ? 'eager' : 'lazy'}
        className="aspect-square h-auto w-full object-cover"
      />
    </div>
  );
}
