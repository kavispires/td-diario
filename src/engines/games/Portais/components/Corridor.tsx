import { Image } from '@components/ui/Image';
import { Pill } from '@components/ui/Pill';
import { Text } from '@components/ui/Typography';
import { useTDImageCardUrl } from '@hooks/useTDImageCardUrl';
import { cn } from '@utils/cn';
import { Repeat } from 'lucide-react';
import { motion } from 'motion/react';

/**
 * Props accepted by the {@link Corridor} component.
 */
type CorridorProps = {
  /**
   * One-based corridor number currently being rendered.
   */
  number: number;
  /**
   * Total number of corridors in today's challenge.
   */
  totalCorridors: number;
  /**
   * Image card ids previewed in the corridor.
   */
  imagesIds: string[];
  /**
   * Width, in pixels, used for each portal image card.
   */
  width: number;
  /**
   * Revealed passcode shown once the game has ended.
   */
  passcode?: string;
  /**
   * How many rotations the player made in this corridor.
   */
  moves: number;
  /**
   * Whether this corridor was successfully completed.
   */
  solved?: boolean;
};

/**
 * Small image tile used by {@link Corridor} to preview a portal's image.
 */
type PortalImageCardProps = {
  /**
   * Image card id returned by the daily payload.
   */
  cardId: string;
  /**
   * Width, in pixels, applied to the rendered tile.
   */
  width: number;
  /**
   * Accessible label describing the image's location in the corridor.
   */
  alt: string;
};

/**
 * Renders one corridor's portal previews plus its step indicator or
 * revealed passcode.
 *
 * @param props Corridor order, images, solved state, and move count.
 * @returns The rendered corridor card.
 */
export function Corridor({
  number,
  totalCorridors,
  imagesIds,
  width,
  passcode,
  moves,
  solved = false,
}: CorridorProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-2">
        {passcode ? (
          <span
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold uppercase shadow-sm',
              solved ? 'bg-gold-soft text-foreground' : 'bg-surface-raised',
            )}
          >
            {passcode}
          </span>
        ) : (
          Array.from({ length: totalCorridors }, (_, index) => {
            const corridorNumber = index + 1;
            const isActive = corridorNumber === number;

            return (
              <span
                key={corridorNumber}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shadow-sm',
                  isActive
                    ? 'bg-gold text-foreground'
                    : 'bg-surface-raised text-subtle-foreground',
                )}
              >
                {corridorNumber}
              </span>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-center">
        <Pill className="bg-white/80 text-chrome shadow-none">
          <Repeat
            className="h-4 w-4"
            aria-hidden="true"
          />
          <Text className="text-sm">{moves} movimentos</Text>
        </Pill>
      </div>

      <div
        className="grid gap-3 rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,243,230,0.9)_0%,rgba(255,226,204,0.72)_40%,rgba(64,59,70,0.92)_100%)] p-4 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${imagesIds.length}, minmax(0, 1fr))`,
        }}
      >
        {imagesIds.map((imageId, index) => (
          <motion.div
            key={imageId}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.06 }}
            className="flex justify-center"
          >
            <PortalImageCard
              cardId={imageId}
              width={width}
              alt={`Portal ${index + 1} do corredor ${number}`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders a single preview image inside a rounded portal frame.
 *
 * @param props Image id, size, and accessible label.
 * @returns The rendered image tile.
 */
function PortalImageCard({ cardId, width, alt }: PortalImageCardProps) {
  const imageUrl = useTDImageCardUrl(cardId);

  return (
    <div
      className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 p-2 shadow-lg"
      style={{ width }}
    >
      <Image
        src={imageUrl}
        alt={alt}
        width="100%"
        height={Math.round(width * 1.2)}
        objectFit="cover"
        className="aspect-[4/5]"
      />
    </div>
  );
}
