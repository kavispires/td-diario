import { playSFX } from '@utils/soundEffects';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  playCountdownSound,
  stopCountdownSound,
} from '../utils/countdownSound';
import { validateButtonPress } from '../utils/engine';
import type { ButtonEntry } from '../utils/types';
import { useCountdown } from '../utils/useCountdown';
import { ButtonContent } from './ButtonContent';
import { CircularTimer } from './CircularTimer';
import { PressButton } from './PressButton';

const DURATION_MAP = {
  quick: 4,
  normal: 6,
  long: 9,
} as const;

/**
 * Props accepted by {@link ButtonPuzzle}.
 */
type ButtonPuzzleProps = {
  /**
   * Resolved Panico button to render and validate.
   */
  button: ButtonEntry;
  /**
   * Called once the button has been judged correct or incorrect.
   */
  onComplete: (isCorrect: boolean) => void;
  /**
   * Width/height of the puzzle region, in pixels.
   */
  size?: number;
};

/**
 * Renders a single timed Panico puzzle, tracking the player's presses and
 * validating them either immediately or when the countdown ends.
 *
 * @param props Active button config, completion callback, and rendered size.
 * @returns The rendered puzzle.
 */
export function ButtonPuzzle({
  button,
  onComplete,
  size = 320,
}: ButtonPuzzleProps) {
  const [pressCount, setPressCount] = useState(0);
  const pressCountRef = useRef(0);
  const playbackIdRef = useRef<number | null>(null);
  const resolvedRef = useRef(false);
  const duration = DURATION_MAP[button.durationScale];

  const complete = useCallback(
    (isCorrect: boolean) => {
      if (resolvedRef.current) {
        return;
      }

      resolvedRef.current = true;
      stopCountdownSound(playbackIdRef.current);
      playbackIdRef.current = null;
      onComplete(isCorrect);
    },
    [onComplete],
  );

  const { remainingMs, timeLeft } = useCountdown({
    duration,
    autoStart: true,
    onExpire: () => {
      complete(
        validateButtonPress(
          pressCountRef.current,
          button.expectedAction,
          button.targetCount,
        ),
      );
    },
  });

  useEffect(() => {
    playbackIdRef.current = playCountdownSound();

    return () => {
      stopCountdownSound(playbackIdRef.current);
      playbackIdRef.current = null;
    };
  }, []);

  function handlePress() {
    if (resolvedRef.current) {
      return;
    }

    playSFX('bubbleIn');
    const nextPressCount = pressCount + 1;
    pressCountRef.current = nextPressCount;
    setPressCount(nextPressCount);

    if (button.verification === 'IMMEDIATE' && timeLeft > 1) {
      window.setTimeout(() => {
        const isCorrect = validateButtonPress(
          pressCountRef.current,
          button.expectedAction,
          button.targetCount,
        );

        if (isCorrect) {
          complete(true);
        }
      }, 350);
    }
  }

  return (
    <div className="flex items-center justify-center">
      <CircularTimer
        duration={duration}
        remainingMs={remainingMs}
        size={size}
      >
        <PressButton
          onPress={handlePress}
          size={size}
          aria-label="Responder botão de Pânico"
          className={
            button.buttonVariant === 'RED'
              ? 'bg-rose-950/70'
              : button.buttonVariant === 'YELLOW'
                ? 'bg-amber-950/70'
                : button.buttonVariant === 'BLUE'
                  ? 'bg-sky-950/70'
                  : undefined
          }
        >
          <ButtonContent
            button={button}
            pressCount={pressCount}
          />
        </PressButton>
      </CircularTimer>
    </div>
  );
}
