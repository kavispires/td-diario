import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Paragraph, Text, Title } from '@components/ui/Typography';
import { ArrowDown } from 'lucide-react';
import type { DailyConjuntosThing } from 'types/games';
import {
  CONJUNTOS_REVIEW_AREA_THING_WIDTH_MULTIPLIER,
  CONJUNTOS_RULE1_AREA,
  CONJUNTOS_RULE2_AREA,
} from '../utils/constants';
import { getAreaLabel } from '../utils/helpers';
import type { DiagramArea } from '../utils/types';
import { InDiagramThings } from './InDiagramThings';
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
 * Inline confirmation card shown once the player picks both a thing and a
 * target area, replacing the original modal with a mobile-friendly panel.
 *
 * @param props Pending placement data, current area contents, and actions.
 * @returns The rendered confirmation panel.
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
  const areaThings =
    activeArea === CONJUNTOS_RULE1_AREA
      ? [...rule1Things, ...intersectingThings]
      : activeArea === CONJUNTOS_RULE2_AREA
        ? [...rule2Things, ...intersectingThings]
        : intersectingThings;

  return (
    <Surface className="flex w-full flex-col items-center gap-3 bg-card px-5 py-5 text-center">
      <Title level={4}>Confirmar jogada</Title>

      <Paragraph className="mb-0 text-center">
        Quer colocar <strong>{activeThing.name}</strong> no{' '}
        <strong>{getAreaLabel(activeArea)}</strong>?
      </Paragraph>

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

      <div className="w-full rounded-3xl bg-surface px-3 py-3">
        {areaThings.length > 0 ? (
          <InDiagramThings
            things={areaThings}
            width={thingWidth * CONJUNTOS_REVIEW_AREA_THING_WIDTH_MULTIPLIER}
          />
        ) : (
          <Text type="secondary">Essa área ainda está vazia.</Text>
        )}
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button
          variant="primary"
          size="small"
          block
          onClick={onConfirm}
        >
          Confirmar
        </Button>
        <Button
          variant="outlined"
          size="small"
          block
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </Surface>
  );
}
