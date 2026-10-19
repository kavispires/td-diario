import { cn } from '@utils/cn';
import { motion, useReducedMotion } from 'motion/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Props accepted by {@link PressButton}.
 */
type PressButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Called whenever the player presses the button.
   */
  onPress: () => void;
  /**
   * Content displayed on the button face.
   */
  children: ReactNode;
  /**
   * Width/height of the rendered button, in pixels.
   */
  size?: number;
  /**
   * Overrides the inner face's solid base color (e.g. for a colored
   * button variant); defaults to the button's dark green face.
   */
  faceClassName?: string;
};

/**
 * Renders Panico's large, tactile button with a pressed-state animation.
 *
 * @param props Native button props plus press handler, content, and size.
 * @returns The interactive button used by the active puzzle.
 */
export function PressButton({
  onPress,
  children,
  size = 300,
  className,
  faceClassName,
  type = 'button',
  ...props
}: PressButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type={type}
      onClick={onPress}
      className={cn(
        'relative rounded-full border border-white/15 bg-[#021207] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/60',
        className,
      )}
      style={{ width: size * 0.9, height: size * 0.9 }}
      {...props}
    >
      <motion.span
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-[#053313] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_rgba(255,255,255,0)_40%,_rgba(0,0,0,0.1)_100%)] shadow-[inset_0_6px_12px_rgba(255,255,255,0.18),inset_0_-18px_30px_rgba(0,0,0,0.35)]',
          faceClassName,
        )}
        initial={{ y: shouldReduceMotion ? 0 : -10 }}
        whileHover={shouldReduceMotion ? undefined : { y: -12 }}
        whileTap={shouldReduceMotion ? undefined : { y: 0 }}
        transition={{ type: 'spring', stiffness: 900, damping: 28 }}
      >
        {children}
      </motion.span>
    </button>
  );
}
