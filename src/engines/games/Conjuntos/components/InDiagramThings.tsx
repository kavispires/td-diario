import type { DailyConjuntosThing } from 'types/games';
import {
  CONJUNTOS_LATEST_THING_WIDTH_MULTIPLIER,
  CONJUNTOS_MINIMIZED_THINGS_THRESHOLD,
  CONJUNTOS_PREVIOUS_THING_WIDTH_MULTIPLIER,
} from '../utils/constants';
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
            width={
              width *
              (isLatestThing
                ? CONJUNTOS_LATEST_THING_WIDTH_MULTIPLIER
                : CONJUNTOS_PREVIOUS_THING_WIDTH_MULTIPLIER)
            }
            minimize={
              array.length > CONJUNTOS_MINIMIZED_THINGS_THRESHOLD &&
              !isLatestThing
            }
            emphasize={isLatestThing}
            className={isLatestThing ? 'max-w-full' : 'max-w-[72px]'}
          />
        );
      })}
    </div>
  );
}
