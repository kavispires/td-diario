import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import { AUTOPLAY_DELAY_MS } from '../utils/constants';
import { DrawingPreview } from './DrawingPreview';

/**
 * Props accepted by the {@link DrawingCarousel} component.
 */
type DrawingCarouselProps = {
  /**
   * Serialized drawing clues shown to the player.
   */
  drawings: string[];
};

/**
 * Renders the rotating set of drawing clues for today's Arte Ruim phrase,
 * with autoplay plus manual dot navigation.
 *
 * @param props Serialized drawings for the current challenge.
 * @returns The rendered drawing carousel.
 */
export function DrawingCarousel({ drawings }: DrawingCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (drawings.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((previousIndex) => (previousIndex + 1) % drawings.length);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearInterval(intervalId);
  }, [drawings.length]);

  const activeDrawing = drawings[activeIndex] ?? drawings[0] ?? '[]';

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {drawings.length > 1 && (
        <div className="flex items-center gap-2">
          {drawings.map((drawing, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${drawing}-${index}`}
                type="button"
                aria-label={`Mostrar desenho ${index + 1}`}
                aria-pressed={isActive}
                className={`h-3 w-3 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  isActive
                    ? 'border-primary bg-primary'
                    : 'border-border-strong bg-card'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            );
          })}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeIndex}-${activeDrawing}`}
          className="mx-auto w-[70%]"
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <DrawingPreview
            drawing={activeDrawing}
            label={`Pista desenhada ${activeIndex + 1}`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
