import { cn } from '@utils/cn';
import type { ReactNode, SVGProps } from 'react';
import type { DiagramArea } from '../utils/types';

/**
 * Props accepted by the {@link Diagram} component.
 */
type DiagramProps = {
  /**
   * Contents rendered inside the left/yellow circle.
   */
  leftCircleChildren: ReactNode;
  /**
   * Contents rendered inside the right/red circle.
   */
  rightCircleChildren: ReactNode;
  /**
   * Contents rendered inside the intersection.
   */
  intersectionChildren: ReactNode;
  /**
   * Currently selected area, if any.
   */
  activeArea: DiagramArea | null;
  /**
   * Called when the player selects one of the diagram areas.
   */
  onSelectArea: (area: DiagramArea) => void;
  /**
   * Whether the diagram areas should be non-interactive.
   */
  disabled?: boolean;
} & SVGProps<SVGSVGElement>;

/**
 * Renders Conjuntos' two-circle diagram, using accessible buttons for the
 * three selectable areas while keeping the original SVG silhouette.
 *
 * @param props Area contents, interaction state, and standard SVG props.
 * @returns The rendered diagram.
 */
export function Diagram({
  leftCircleChildren,
  rightCircleChildren,
  intersectionChildren,
  activeArea,
  onSelectArea,
  disabled = false,
  className,
  ...props
}: DiagramProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 760 500"
      className={className}
      {...props}
    >
      <title>Diagrama de conjuntos</title>
      <path
        fill="#fbb03b"
        stroke="#000"
        strokeMiterlimit="10"
        strokeWidth="5"
        d="M252.78 3.5c-136.42 0-247 110.59-247 247s110.59 247 247 247 247-110.59 247-247-110.59-247-247-247zm.99 483.07C123.39 486.57 17.7 380.88 17.7 250.5S123.39 14.43 253.77 14.43 489.84 120.12 489.84 250.5 384.15 486.57 253.77 486.57z"
      />
      <path
        fill="#f15a24"
        stroke="#000"
        strokeMiterlimit="10"
        strokeWidth="5"
        d="M508.22 3.5c-136.41 0-247 110.59-247 247s110.59 247 247 247 247-110.59 247-247-110.58-247-247-247zm.99 483.07c-130.38 0-236.07-105.69-236.07-236.07S378.84 14.43 509.22 14.43 745.29 120.12 745.29 250.5 639.6 486.57 509.22 486.57z"
      />
      <path
        fill="#eee"
        d="M487.34 250.5c0-62.39-24.29-121.04-68.41-165.16a235.9 235.9 0 00-37.43-30.47 235.35 235.35 0 00-37.43 30.47c-44.12 44.11-68.41 102.77-68.41 165.16s24.29 121.04 68.41 165.16a235.9 235.9 0 0037.43 30.47 235.35 235.35 0 0037.43-30.47c44.12-44.11 68.41-102.77 68.41-165.16z"
      />
      <path
        fill="#eee"
        d="M258.72 250.5c0-66.64 25.95-129.3 73.08-176.42a253.125 253.125 0 0134.1-28.57c-33.98-18.65-72.29-28.57-112.13-28.57-62.39 0-121.04 24.29-165.16 68.41C44.5 129.46 20.2 188.11 20.2 250.5s24.29 121.04 68.41 165.16c44.11 44.12 102.77 68.41 165.16 68.41 39.84 0 78.15-9.92 112.13-28.57a252.507 252.507 0 01-34.1-28.57c-47.12-47.12-73.08-109.78-73.08-176.42zM674.37 85.34C630.25 41.22 571.6 16.93 509.21 16.93c-40.27 0-78.98 10.14-113.24 29.18 11.74 8.26 22.86 17.6 33.22 27.96 47.12 47.12 73.08 109.78 73.08 176.42s-25.95 129.3-73.08 176.42a252.312 252.312 0 01-33.22 27.96c34.25 19.04 72.96 29.18 113.24 29.18 62.39 0 121.04-24.29 165.16-68.41 44.12-44.11 68.41-102.77 68.41-165.16s-24.29-121.04-68.41-165.16z"
      />
      <foreignObject
        x="30"
        y="25"
        width="250"
        height="450"
      >
        <button
          type="button"
          aria-label="Escolher círculo amarelo"
          aria-pressed={activeArea === 1}
          disabled={disabled}
          onClick={() => onSelectArea(1)}
          className={cn(
            'grid h-full w-full place-items-center rounded-tl-[80%] rounded-bl-[70%] bg-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-default',
            !disabled && 'cursor-pointer hover:bg-white/15',
            activeArea === 1 &&
              'bg-white/25 outline outline-4 outline-secondary',
          )}
        >
          {leftCircleChildren}
        </button>
      </foreignObject>
      <foreignObject
        x="480"
        y="25"
        width="250"
        height="450"
      >
        <button
          type="button"
          aria-label="Escolher círculo vermelho"
          aria-pressed={activeArea === 2}
          disabled={disabled}
          onClick={() => onSelectArea(2)}
          className={cn(
            'grid h-full w-full place-items-center rounded-tr-[80%] rounded-br-[70%] bg-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-default',
            !disabled && 'cursor-pointer hover:bg-white/15',
            activeArea === 2 &&
              'bg-white/25 outline outline-4 outline-secondary',
          )}
        >
          {rightCircleChildren}
        </button>
      </foreignObject>
      <foreignObject
        x="290"
        y="65"
        width="182"
        height="370"
      >
        <button
          type="button"
          aria-label="Escolher interseção"
          aria-pressed={activeArea === 0}
          disabled={disabled}
          onClick={() => onSelectArea(0)}
          className={cn(
            'grid h-full w-full place-items-center rounded-full bg-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-default',
            !disabled && 'cursor-pointer hover:bg-white/15',
            activeArea === 0 &&
              'bg-white/25 outline outline-4 outline-secondary',
          )}
        >
          {intersectionChildren}
        </button>
      </foreignObject>
    </svg>
  );
}
