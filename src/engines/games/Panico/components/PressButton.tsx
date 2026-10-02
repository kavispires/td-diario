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
  type = 'button',
  ...props
}: PressButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type={type}
      onClick={onPress}
      className={cn(
        'relative rounded-full border border-white/15 bg-slate-900/80 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/60',
        className,
      )}
      style={{ width: size * 0.82, height: size * 0.82 }}
      {...props}
    >
      <motion.span
        className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_rgba(255,255,255,0.04)_35%,_rgba(0,0,0,0.15)_100%)] shadow-[inset_0_6px_12px_rgba(255,255,255,0.18),inset_0_-18px_30px_rgba(0,0,0,0.35)]"
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
