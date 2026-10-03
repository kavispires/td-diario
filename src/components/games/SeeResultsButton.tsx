import { Button } from '@components/ui/Button';
import { AnimatePresence, motion } from 'motion/react';

/**
 * Props accepted by the {@link SeeResultsButton} component.
 */
type SeeResultsButtonProps = {
  /**
   * Whether today's game has reached a win/lose state. The button only
   * mounts (and animates in) once this becomes `true`.
   */
  isComplete: boolean;
  /**
   * Reveals the game's results splash.
   */
  setShowResults: (show: boolean) => void;
};

/**
 * Animated "Ver resultado" button shown once a game is complete, letting the
 * player open its results splash on demand instead of waiting for it to
 * auto-show. The results splash is a fullscreen overlay, so it's safe for
 * this button to stay mounted underneath it once `isComplete` is `true`.
 *
 * @param props Completion state and the handler that reveals the results
 * splash.
 * @returns The rendered button, animated in as `isComplete` becomes `true`.
 */
export function SeeResultsButton({
  isComplete,
  setShowResults,
}: SeeResultsButtonProps) {
  return (
    <AnimatePresence>
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.3 }}
        >
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowResults(true)}
          >
            Ver resultado
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
