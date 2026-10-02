import type { DailyConjuntosThing } from 'types/games';
import { ThingCard } from './ThingCard';

/**
 * Props accepted by the {@link InDiagramThings} component.
 */
type InDiagramThingsProps = {
  /**
   * Things already placed in one diagram area.
   */
  things: DailyConjuntosThing[];
  /**
   * Base width, in pixels, used to size each thing.
   */
  width: number;
};

/**
 * Renders the stack of things already placed inside one area of the
 * diagram, enlarging the latest thing while keeping older ones compact.
 *
 * @param props Things currently in the area and their base width.
 * @returns The rendered area contents.
 */
export function InDiagramThings({ things, width }: InDiagramThingsProps) {
  return (
    <div className="flex h-full w-full flex-wrap content-center items-center justify-center gap-2">
      {things.map((thing, index, array) => {
        const isLatestThing = index === array.length - 1;

        return (
          <ThingCard
            key={`${thing.id}-${index}`}
            itemId={thing.id}
            name={thing.name}
            width={width * (isLatestThing ? 1.15 : 0.8)}
            minimize={array.length > 3 && !isLatestThing}
            emphasize={isLatestThing}
            className={isLatestThing ? 'max-w-full' : 'max-w-[72px]'}
          />
        );
      })}
    </div>
  );
}
