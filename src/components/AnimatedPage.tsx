import { cn } from '@utils/cn';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Props accepted by the {@link AnimatedPage} component.
 */
type AnimatedPageProps = {
  /**
   * Page content to animate in and out.
   */
  children: ReactNode;
  /**
   * Additional CSS classes to apply to the animated wrapper.
   */
  className?: string;
};

/**
 * Wraps route content with a fade/slide transition, used to animate screen
 * changes between routes.
 *
 * @param props Page content to render inside the animated wrapper.
 * @returns A motion-animated wrapper element.
 */
export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('h-full w-full px-4 py-4', className)}
    >
      {children}
    </motion.div>
  );
}
