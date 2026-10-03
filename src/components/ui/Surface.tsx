import { cn } from '@utils/cn';
import type { ComponentProps } from 'react';

/**
 * Props accepted by the {@link Surface} component. Accepts every standard
 * `div` prop; `className` extends (rather than replaces) the base surface
 * styling.
 */
type SurfaceProps = ComponentProps<'div'>;

/**
 * Renders the large-rounded, soft-shadow panel reused throughout game
 * screens for prompts, stat boxes, and results sub-panels. Background
 * color, padding, and layout are left entirely to the caller's
 * `className`, since those intentionally vary by game and game state
 * (e.g. win/lose tinting).
 *
 * @param props Standard `div` props; `className` is merged with the base
 *   `rounded-[2rem] shadow-sm` styling.
 * @returns The rendered surface container.
 */
export function Surface({ className, ...props }: SurfaceProps) {
  return (
    <div
      className={cn('rounded-[2rem] shadow-sm', className)}
      {...props}
    />
  );
}
