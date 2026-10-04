import { cn } from '@utils/cn';
import { ImageOff, X, ZoomIn, ZoomOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

/**
 * Object-fit strategies supported by the {@link Image} component.
 */
type ImageObjectFit = 'cover' | 'contain' | 'fill';

/**
 * Props accepted by the {@link Image} component.
 */
type ImageProps = {
  /**
   * Image source.
   */
  src: string;
  /**
   * Accessible description of the image.
   */
  alt: string;
  /**
   * Rendered width, in pixels or any valid CSS length.
   */
  width?: number | string;
  /**
   * Rendered height, in pixels or any valid CSS length.
   */
  height?: number | string;
  /**
   * How the image fills its box. Defaults to `cover`.
   */
  objectFit?: ImageObjectFit;
  /**
   * Alternate source shown when `src` fails to load.
   */
  fallback?: string;
  /**
   * Rounds the image's corners. Defaults to `true`.
   */
  rounded?: boolean;
  /**
   * Enables a full-screen preview when the image is tapped. Defaults to
   * `true`.
   */
  preview?: boolean;
  /**
   * Additional classes merged with the image's own classes.
   */
  className?: string;
};

/**
 * 2D coordinate used to track pointer positions and pan offsets.
 */
type Point = { x: number; y: number };

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.75;
const DOUBLE_TAP_MS = 300;

function clampScale(value: number): number {
  return Math.min(Math.max(value, MIN_SCALE), MAX_SCALE);
}

const OBJECT_FIT_CLASSES: Record<ImageObjectFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
};

/**
 * Renders an image with a loading skeleton, an optional fallback on error,
 * and an optional tap-to-preview full-screen overlay, similar to Ant
 * Design's `Image` component.
 *
 * @param props Image source, dimensions, fit strategy, fallback, and
 *   preview options.
 * @returns The image element, plus a portal-rendered preview overlay while
 *   open.
 */
export function Image({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  fallback,
  rounded = true,
  preview = true,
  className,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scale, setScale] = useState(MIN_SCALE);
  const [translate, setTranslate] = useState<Point>({ x: 0, y: 0 });
  const [interacting, setInteracting] = useState(false);

  const previewImgRef = useRef<HTMLImageElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, Point>());
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(
    null,
  );
  const panStartRef = useRef<{ x: number; y: number; translate: Point } | null>(
    null,
  );
  const lastTapRef = useRef(0);

  const resolvedSrc = failed && fallback ? fallback : src;
  const showBrokenState = failed && !fallback;

  const style: CSSProperties = { width, height };

  const clampTranslate = useCallback(
    (next: Point, currentScale: number): Point => {
      const img = previewImgRef.current;
      const container = previewContainerRef.current;
      if (!img || !container) {
        return next;
      }
      const containerRect = container.getBoundingClientRect();
      const maxX = Math.max(
        (img.clientWidth * currentScale - containerRect.width) / 2,
        0,
      );
      const maxY = Math.max(
        (img.clientHeight * currentScale - containerRect.height) / 2,
        0,
      );
      return {
        x: Math.min(Math.max(next.x, -maxX), maxX),
        y: Math.min(Math.max(next.y, -maxY), maxY),
      };
    },
    [],
  );

  // Keeps the pan offset within bounds whenever the zoom level changes, and
  // resets it entirely once fully zoomed out.
  useEffect(() => {
    setTranslate((prev) =>
      scale <= MIN_SCALE ? { x: 0, y: 0 } : clampTranslate(prev, scale),
    );
  }, [scale, clampTranslate]);

  // Resets zoom/pan whenever the preview is opened or closed.
  useEffect(() => {
    if (!previewOpen) {
      setScale(MIN_SCALE);
      setTranslate({ x: 0, y: 0 });
    }
  }, [previewOpen]);

  function zoomTo(nextScale: number) {
    setScale(clampScale(nextScale));
  }

  function toggleZoom() {
    setScale((prev) => (prev > MIN_SCALE ? MIN_SCALE : 2));
  }

  function handlePreviewPointerDown(
    event: ReactPointerEvent<HTMLImageElement>,
  ) {
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    setInteracting(true);

    if (pointersRef.current.size === 2) {
      const [first, second] = Array.from(pointersRef.current.values());
      pinchStartRef.current = {
        distance: Math.hypot(second.x - first.x, second.y - first.y),
        scale,
      };
      panStartRef.current = null;
      return;
    }

    if (scale > MIN_SCALE) {
      panStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        translate,
      };
    }

    const now = Date.now();
    if (now - lastTapRef.current < DOUBLE_TAP_MS) {
      lastTapRef.current = 0;
      toggleZoom();
    } else {
      lastTapRef.current = now;
    }
  }

  function handlePreviewPointerMove(
    event: ReactPointerEvent<HTMLImageElement>,
  ) {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const [first, second] = Array.from(pointersRef.current.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const nextScale = clampScale(
        pinchStartRef.current.scale *
          (distance / pinchStartRef.current.distance),
      );
      setScale(nextScale);
      setTranslate((prev) => clampTranslate(prev, nextScale));
      return;
    }

    if (panStartRef.current && scale > MIN_SCALE) {
      const dx = event.clientX - panStartRef.current.x;
      const dy = event.clientY - panStartRef.current.y;
      setTranslate(
        clampTranslate(
          {
            x: panStartRef.current.translate.x + dx,
            y: panStartRef.current.translate.y + dy,
          },
          scale,
        ),
      );
    }
  }

  function handlePreviewPointerEnd(event: ReactPointerEvent<HTMLImageElement>) {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
      setInteracting(false);
    }
  }

  function handlePreviewWheel(event: ReactWheelEvent<HTMLImageElement>) {
    event.preventDefault();
    zoomTo(scale - event.deltaY * 0.01);
  }

  return (
    <>
      <span
        className={cn(
          'relative inline-block overflow-hidden bg-border',
          rounded && 'rounded-2xl',
          className,
        )}
        style={style}
      >
        {!loaded && !showBrokenState && (
          <span
            className="absolute inset-0 animate-pulse bg-border"
            aria-hidden="true"
          />
        )}
        {showBrokenState ? (
          <span className="flex h-full w-full items-center justify-center text-subtle-foreground">
            <ImageOff
              size={24}
              aria-hidden="true"
            />
          </span>
        ) : (
          // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users can already reach the image via Tab; preview is a supplementary pointer affordance, not the only way to view it
          <img
            src={resolvedSrc}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            onClick={preview ? () => setPreviewOpen(true) : undefined}
            className={cn(
              'h-full w-full',
              OBJECT_FIT_CLASSES[objectFit],
              preview && 'cursor-zoom-in',
            )}
          />
        )}
      </span>
      {createPortal(
        <AnimatePresence>
          {previewOpen && (
            <motion.div
              ref={previewContainerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/95 p-4"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setPreviewOpen(false);
                }
              }}
            >
              <img
                ref={previewImgRef}
                src={resolvedSrc}
                alt={alt}
                draggable={false}
                onPointerDown={handlePreviewPointerDown}
                onPointerMove={handlePreviewPointerMove}
                onPointerUp={handlePreviewPointerEnd}
                onPointerCancel={handlePreviewPointerEnd}
                onWheel={handlePreviewWheel}
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transition: interacting ? 'none' : 'transform 0.16s ease-out',
                }}
                className={cn(
                  'max-h-full max-w-full touch-none object-contain select-none',
                  scale > MIN_SCALE ? 'cursor-grab' : 'cursor-zoom-in',
                )}
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <button
                  type="button"
                  onClick={() => zoomTo(scale - ZOOM_STEP)}
                  disabled={scale <= MIN_SCALE}
                  aria-label="Diminuir zoom"
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-40"
                >
                  <ZoomOut
                    size={20}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => zoomTo(scale + ZOOM_STEP)}
                  disabled={scale >= MAX_SCALE}
                  aria-label="Aumentar zoom"
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 disabled:opacity-40"
                >
                  <ZoomIn
                    size={20}
                    aria-hidden="true"
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                aria-label="Fechar"
                className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X
                  size={20}
                  aria-hidden="true"
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
