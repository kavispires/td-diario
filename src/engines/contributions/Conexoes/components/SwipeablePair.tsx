import { Text } from '@components/ui/Typography';
import {
  motion,
  type PanInfo,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { useState } from 'react';
import {
  SWIPE_BACKGROUND_COLORS,
  SWIPE_CARD_ANIMATION_DURATION_SECONDS,
  SWIPE_CARD_DRAG_ELASTIC,
  SWIPE_CARD_ENTRY_OFFSET_Y,
  SWIPE_HINT_THRESHOLD,
  SWIPE_THRESHOLD,
} from '../utils/constants';
import type { PairToEvaluate } from '../utils/types';
import { PairImageCard } from './PairImageCard';

/**
 * Props accepted by the {@link SwipeablePair} component.
 */
type SwipeablePairProps = {
  /**
   * Pair currently being evaluated.
   */
  pair: PairToEvaluate;
  /**
   * Width and height applied to each rendered image card.
   */
  cardWidth: number;
  /**
   * Called once the player confirms whether the pair is related.
   */
  onEvaluate: (isRelated: boolean) => void;
  /**
   * Disables drag interactions while a save is in flight.
   */
  disabled?: boolean;
};

/**
 * Renders the current pair inside a draggable surface so the player can
 * swipe right for "Sim" or left for "Não", while still keeping buttons as
 * the primary accessible action.
 *
 * @param props Current pair, card sizing, evaluation callback, and disabled state.
 * @returns The rendered swipeable pair.
 */
export function SwipeablePair({
  pair,
  cardWidth,
  onEvaluate,
  disabled = false,
}: SwipeablePairProps) {
  const x = useMotionValue(0);
  const [dragHint, setDragHint] = useState<'related' | 'unrelated' | null>(
    null,
  );
  const backgroundColor = useTransform(
    x,
    [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    SWIPE_BACKGROUND_COLORS,
  );

  /**
   * Resolves the swipe gesture into a yes/no answer once the drag ends.
   *
   * @param _event - Unused pointer event received from Motion.
   * @param info - Drag metadata, including the final horizontal offset.
   */
  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    setDragHint(null);

    if (info.offset.x >= SWIPE_THRESHOLD) {
      onEvaluate(true);
      return;
    }

    if (info.offset.x <= -SWIPE_THRESHOLD) {
      onEvaluate(false);
      return;
    }

    x.set(0);
  }

  return (
    <motion.div
      key={pair.pairId}
      drag={disabled ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={SWIPE_CARD_DRAG_ELASTIC}
      onDrag={(_, info) => {
        if (info.offset.x >= SWIPE_HINT_THRESHOLD) {
          setDragHint('related');
          return;
        }

        if (info.offset.x <= -SWIPE_HINT_THRESHOLD) {
          setDragHint('unrelated');
          return;
        }

        setDragHint(null);
      }}
      onDragEnd={handleDragEnd}
      style={{ x, backgroundColor }}
      className="w-full rounded-[2rem] border border-border bg-card p-4 shadow-sm"
      initial={{ opacity: 0, y: SWIPE_CARD_ENTRY_OFFSET_Y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: SWIPE_CARD_ANIMATION_DURATION_SECONDS,
        ease: 'easeOut',
      }}
    >
      <div className="grid grid-cols-2 justify-items-center gap-4">
        <PairImageCard
          imageId={pair.imageId1}
          label="Primeira imagem do par atual"
          width={cardWidth}
          priority
        />
        <PairImageCard
          imageId={pair.imageId2}
          label="Segunda imagem do par atual"
          width={cardWidth}
          priority
        />
      </div>

      <div className="mt-4 text-center">
        <Text
          type={
            dragHint === 'related'
              ? 'success'
              : dragHint === 'unrelated'
                ? 'danger'
                : 'secondary'
          }
          strong={dragHint !== null}
          className="text-sm"
        >
          {dragHint === 'related'
            ? 'Sim → essas imagens combinam'
            : dragHint === 'unrelated'
              ? '← Não, esse par não conecta'
              : 'Deslize para avaliar ou use os botões abaixo'}
        </Text>
      </div>
    </motion.div>
  );
}
