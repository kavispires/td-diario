import { cn } from '@utils/cn';
import { useMemo } from 'react';
import { DRAWING_VIEWBOX_SIZE } from '../utils/constants';

/**
 * Props accepted by the {@link DrawingPreview} component.
 */
type DrawingPreviewProps = {
  /**
   * Serialized Arte Ruim drawing to render.
   */
  drawing: string;
  /**
   * Accessible label describing the rendered clue.
   */
  label: string;
  /**
   * Optional extra classes applied to the preview frame.
   */
  className?: string;
};

/**
 * Best-effort parser for the serialized line format used by Arte Ruim
 * drawing clues.
 *
 * @param drawing - JSON-serialized array of freehand lines.
 * @returns Parsed numeric lines when valid, otherwise an empty list.
 */
function parseDrawing(drawing: string): number[][] {
  try {
    const parsed: unknown = JSON.parse(drawing);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (line): line is number[] =>
        Array.isArray(line) && line.every((point) => typeof point === 'number'),
    );
  } catch {
    return [];
  }
}

/**
 * Converts parsed drawing lines into SVG path strings.
 *
 * @param lines - Parsed line arrays from one drawing.
 * @returns One SVG path string per valid line.
 */
function getDrawingPaths(lines: number[][]): string[] {
  return lines.flatMap((line) => {
    if (line.length < 4) {
      return [];
    }

    let path = '';

    for (let index = 0; index + 3 < line.length; index += 2) {
      path += `M${line[index]},${line[index + 1]} L${line[index + 2]},${line[index + 3]}`;
    }

    return path ? [path] : [];
  });
}

/**
 * Renders one serialized Arte Ruim clue inside a square SVG frame.
 *
 * @param props Drawing data plus label and optional styling.
 * @returns The rendered clue preview.
 */
export function DrawingPreview({
  drawing,
  label,
  className,
}: DrawingPreviewProps) {
  const paths = useMemo(
    () => getDrawingPaths(parseDrawing(drawing)),
    [drawing],
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${DRAWING_VIEWBOX_SIZE} ${DRAWING_VIEWBOX_SIZE}`}
      role="img"
      aria-label={label}
      className={cn(
        'aspect-square w-full rounded-[2rem] border-2 border-border bg-white p-2 shadow-sm',
        className,
      )}
    >
      <rect
        width={DRAWING_VIEWBOX_SIZE}
        height={DRAWING_VIEWBOX_SIZE}
        rx="32"
        fill="white"
      />

      {paths.map((path, index) => (
        <path
          key={`${path}-${index}`}
          d={path}
          fill="none"
          stroke="#111827"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
