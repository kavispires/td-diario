import { Image } from '@components/ui/Image';
import { Text } from '@components/ui/Typography';
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
   * Whether the kid's name should be rendered underneath the image.
   */
  showName?: boolean;
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
export function KidPortrait({
  kid,
  width,
  showName = false,
  className,
}: KidPortraitProps) {
  const imageUrl = useTDImageCardUrl(kid.id);

  return (
    <div className={className}>
      <Image
        src={imageUrl}
        alt={kid.name.pt}
        width={width}
        height={width * 1.35}
        preview={false}
        rounded
        className="shadow-sm"
      />
      {showName && (
        <Text
          strong
          className="mt-2 block text-center text-sm"
        >
          {kid.name.pt}
        </Text>
      )}
    </div>
  );
}
