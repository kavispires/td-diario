import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import {
  CANVAS_VIEWBOX_SIZE,
  ROUND_DURATION_SECONDS,
  STROKE_WIDTH,
} from '../utils/constants';
import {
  clampCanvasPoint,
  deserializeDrawing,
  getDrawingPaths,
} from '../utils/helpers';
import type { CanvasLine, CanvasLinesSetter } from '../utils/types';

/**
 * Props accepted by the internal {@link SketchBoard} component.
 */
type SketchBoardProps = {
  /**
   * Current freehand lines shown on the board.
   */
  lines: CanvasLine[];
  /**
   * State setter used to append new points while drawing.
   */
  setLines: CanvasLinesSetter;
};

/**
 * Props accepted by the exported {@link Canvas} component.
 */
type CanvasProps = {
  /**
   * Called once the timed drawing round ends.
   */
  onComplete: (lines: CanvasLine[]) => void;
};

/**
 * Props accepted by the exported {@link DrawingPreview} component.
 */
type DrawingPreviewProps = {
  /**
   * JSON-serialized Picaco drawing to preview.
   */
  drawing: string;
  /**
   * Optional extra classes applied to the preview frame.
   */
  className?: string;
  /**
   * Accessible label describing whose drawing is being previewed.
   */
  label: string;
};

/**
 * Normalizes a pointer event position into Picaco's fixed `500 x 500`
 * drawing space.
 *
 * @param event - Pointer event fired by the SVG drawing board.
 * @param svg - SVG element receiving the drawing interaction.
 * @returns The clamped point in viewBox coordinates.
 */
function getPointerPoint(
  event: React.PointerEvent<SVGSVGElement>,
  svg: SVGSVGElement,
) {
  const rect = svg.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * CANVAS_VIEWBOX_SIZE;
  const y = ((event.clientY - rect.top) / rect.height) * CANVAS_VIEWBOX_SIZE;

  return {
    x: clampCanvasPoint(x),
    y: clampCanvasPoint(y),
  };
}

/**
 * Low-level SVG drawing board used by Picaco's timed rounds.
 *
 * @param props Current lines plus the setter that receives new strokes.
 * @returns An interactive drawing surface.
 */
function SketchBoard({ lines, setLines }: SketchBoardProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isDrawingRef = useRef(false);

  /**
   * Starts a new freehand stroke at the current pointer position.
   *
   * @param event - Pointer-down event on the drawing board.
   */
  function handlePointerDown(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;

    const { x, y } = getPointerPoint(event, svg);
    setLines((previousLines) => [...previousLines, [x, y]]);
  }

  /**
   * Appends points to the active stroke while the pointer moves.
   *
   * @param event - Pointer-move event on the drawing board.
   */
  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!isDrawingRef.current) {
      return;
    }

    const svg = svgRef.current;
    if (!svg) {
      return;
    }

    const { x, y } = getPointerPoint(event, svg);
    setLines((previousLines) => {
      if (previousLines.length === 0) {
        return previousLines;
      }

      const nextLines = [...previousLines];
      const lastLine = nextLines[nextLines.length - 1] ?? [];
      nextLines[nextLines.length - 1] = [...lastLine, x, y];
      return nextLines;
    });
  }

  /**
   * Ends the current freehand stroke.
   */
  function stopDrawing() {
    isDrawingRef.current = false;
  }

  const paths = getDrawingPaths(lines);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${CANVAS_VIEWBOX_SIZE} ${CANVAS_VIEWBOX_SIZE}`}
      className="aspect-square w-full touch-none rounded-[2rem] border-2 border-border bg-white shadow-sm"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrawing}
      onPointerLeave={stopDrawing}
      onPointerCancel={stopDrawing}
      role="img"
      aria-label="Área para desenhar a frase do turno"
    >
      <rect
        width={CANVAS_VIEWBOX_SIZE}
        height={CANVAS_VIEWBOX_SIZE}
        rx="32"
        fill="white"
      />

      {paths.map((path, index) => (
        <path
          key={`${path}-${index}`}
          d={path}
          fill="none"
          stroke="#111827"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/**
 * Timed drawing round used by Picaco: it renders the countdown, the freehand
 * board, and automatically finalizes the sketch when time runs out.
 *
 * @param props Completion handler called with the round's finished lines.
 * @returns The timed Picaco drawing area.
 */
export function Canvas({ onComplete }: CanvasProps) {
  const [lines, setLines] = useState<CanvasLine[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_DURATION_SECONDS);
  const linesRef = useRef(lines);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsLeft((previousSeconds) => {
        if (previousSeconds <= 1) {
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete(linesRef.current);
          }
          window.clearInterval(intervalId);
          return 0;
        }

        return previousSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [onComplete]);

  return (
    <div className="w-full space-y-3">
      <div className="space-y-2">
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{
              width: `${(secondsLeft / ROUND_DURATION_SECONDS) * 100}%`,
            }}
            transition={{ ease: 'linear', duration: 0.2 }}
          />
        </div>

        <Text
          type="secondary"
          className="block text-center text-sm"
        >
          {secondsLeft}s restantes
        </Text>
      </div>

      <SketchBoard
        lines={lines}
        setLines={setLines}
      />

      <div className="flex justify-center">
        <Button
          variant="outlined"
          size="small"
          onClick={() => setLines([])}
          aria-label="Limpar o desenho atual"
        >
          Limpar desenho
        </Button>
      </div>
    </div>
  );
}

/**
 * Renders a non-interactive SVG preview of a saved Picaco drawing.
 *
 * @param props Serialized drawing plus labeling and optional classes.
 * @returns A compact drawing preview frame.
 */
export function DrawingPreview({
  drawing,
  className,
  label,
}: DrawingPreviewProps) {
  const lines = deserializeDrawing(drawing);
  const paths = getDrawingPaths(lines);
  const hasDrawing = paths.length > 0;

  return (
    <div
      className={cn(
        'flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white',
        className,
      )}
      role="img"
      aria-label={label}
    >
      <AnimatePresence mode="wait">
        {hasDrawing ? (
          <motion.svg
            key="drawing"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${CANVAS_VIEWBOX_SIZE} ${CANVAS_VIEWBOX_SIZE}`}
            className="h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <rect
              width={CANVAS_VIEWBOX_SIZE}
              height={CANVAS_VIEWBOX_SIZE}
              fill="white"
            />
            {paths.map((path, index) => (
              <path
                key={`${path}-${index}`}
                d={path}
                fill="none"
                stroke="#111827"
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </motion.svg>
        ) : (
          <motion.div
            key="empty"
            className="px-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Text
              type="secondary"
              className="text-xs"
            >
              Sem traços suficientes
            </Text>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
