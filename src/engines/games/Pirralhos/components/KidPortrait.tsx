import { Image } from '@components/ui/Image';
import { useTDImageCardUrl } from '@hooks/useTDImageCardUrl';
import type { KidProfile } from '../utils/constants';

/**
 * Props accepted by the {@link KidPortrait} component.
 */
type KidPortraitProps = {
  /**
   * Static kid profile describing the image and visible labels.
   */
  kid: KidProfile;
  /**
   * Width of the portrait image, in pixels.
   */
  width: number;
  /**
   * Optional class name applied to the outer wrapper.
   */
  className?: string;
};

/**
 * Renders one Pirralhos kid portrait using the shared TD image-card assets.
 *
 * @param props Kid profile, image width, and display options.
 * @returns The rendered portrait block.
 */
export function KidPortrait({ kid, width, className }: KidPortraitProps) {
  const imageUrl = useTDImageCardUrl(kid.id);

  return (
    <div className={className}>
      <Image
        src={imageUrl}
        alt={kid.name.pt}
        width={width}
        height={width * 1.5}
        preview={false}
        rounded
        className="shadow-sm"
      />
    </div>
  );
}
