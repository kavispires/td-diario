import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { ArrowDown } from 'lucide-react';
import type { DailyConjuntosThing } from 'types/games';
import {
  CONJUNTOS_AREA_BACKGROUND_CLASSES,
  CONJUNTOS_RULE1_AREA,
  CONJUNTOS_RULE2_AREA,
} from '../utils/constants';
import { getAreaLabel } from '../utils/helpers';
import type { DiagramArea } from '../utils/types';
import { ThingCard } from './ThingCard';

/**
 * Props accepted by the {@link PlacementReview} component.
 */
type PlacementReviewProps = {
  /**
   * Thing the player is about to place.
   */
  activeThing: DailyConjuntosThing;
  /**
   * Diagram area currently selected for that thing.
   */
  activeArea: DiagramArea;
  /**
   * Things already confirmed inside the left/yellow circle.
   */
  rule1Things: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the right/red circle.
   */
  rule2Things: DailyConjuntosThing[];
  /**
   * Things already confirmed inside the intersection.
   */
  intersectingThings: DailyConjuntosThing[];
  /**
   * Called to cancel the pending placement.
   */
  onCancel: () => void;
  /**
   * Called to confirm the pending placement.
   */
  onConfirm: () => void;
  /**
   * Base width, in pixels, used to size item sprites in the preview.
   */
  thingWidth: number;
};

/**
 * Returns the things currently present in the specified diagram area.
 *
 * @param activeArea The area to check.
 * @param rule1Things Things in the left/yellow circle.
 * @param rule2Things Things in the right/red circle.
 * @param intersectingThings Things in the intersection.
 * @returns The things present in the specified area.
 */
function getThingsInArea(
  activeArea: DiagramArea,
  rule1Things: DailyConjuntosThing[],
  rule2Things: DailyConjuntosThing[],
  intersectingThings: DailyConjuntosThing[],
) {
  if (activeArea === CONJUNTOS_RULE1_AREA) {
    return [...rule1Things, ...intersectingThings];
  }
  if (activeArea === CONJUNTOS_RULE2_AREA) {
    return [...rule2Things, ...intersectingThings];
  }
  return intersectingThings;
}

/**
 * Confirmation modal shown once the player picks both a thing and a target
 * area, asking them to confirm or cancel the pending placement.
 *
 * @param props Pending placement data, current area contents, and actions.
 * @returns The rendered confirmation modal.
 */
export function PlacementReview({
  activeThing,
  activeArea,
  rule1Things,
  rule2Things,
  intersectingThings,
  onCancel,
  onConfirm,
  thingWidth,
}: PlacementReviewProps) {
  const areaThings = getThingsInArea(
    activeArea,
    rule1Things,
    rule2Things,
    intersectingThings,
  );

  return (
    <Modal
      open
      onClose={onCancel}
      title={`Tem certeza que quer colocar ${activeThing.name} ${getAreaLabel(activeArea)}?`}
    >
      <div className="flex w-full flex-col items-center gap-3 text-center">
        <ThingCard
          itemId={activeThing.id}
          name={activeThing.name}
          width={thingWidth}
          emphasize
        />

        <ArrowDown
          className="h-5 w-5 text-subtle-foreground"
          aria-hidden="true"
        />

        <div
          className={cn(
            'w-full rounded-3xl px-3 py-3',
            CONJUNTOS_AREA_BACKGROUND_CLASSES[activeArea],
          )}
        >
          {areaThings.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {areaThings.map((thing) => (
                <ThingCard
                  key={thing.id}
                  itemId={thing.id}
                  name={thing.name}
                  width={thingWidth}
                />
              ))}
            </div>
          ) : (
            <Text type="secondary">Essa área ainda está vazia.</Text>
          )}
        </div>

        <div className="flex w-full gap-3">
          <Button
            variant="outlined"
            size="small"
            block
            onClick={onCancel}
          >
            Não
          </Button>
          <Button
            variant="primary"
            size="small"
            block
            onClick={onConfirm}
          >
            Sim
          </Button>
        </div>
      </div>
    </Modal>
  );
}
