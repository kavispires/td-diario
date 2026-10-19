import { cn } from '@utils/cn';
import { playSFX } from '@utils/soundEffects';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DURATION_MAP } from '../utils/constants';
import {
  playCountdownSound,
  stopCountdownSound,
} from '../utils/countdownSound';
import { validateButtonPress } from '../utils/engine';
import type { ButtonEntry, PanicoButtonVariant } from '../utils/types';
import { useCountdown } from '../utils/useCountdown';
import { ButtonContent } from './ButtonContent';
import { CircularTimer } from './CircularTimer';
import { PressButton } from './PressButton';

/**
 * Outer rim / inner face background classes applied to the press button per
 * {@link PanicoButtonVariant}, so its color hints at the expected action.
 * The inner face uses a visibly brighter shade than the rim for contrast.
 */
const BUTTON_VARIANT_BG_CLASSES: Record<
  PanicoButtonVariant,
  { outer: string; inner: string }
> = {
  RED: { outer: 'bg-[#420c11]', inner: 'bg-[#a51d2b]' },
  YELLOW: { outer: 'bg-[#4d3f06]', inner: 'bg-[#be9c10]' },
  BLUE: { outer: 'bg-[#162d5e]', inner: 'bg-[#436ec8]' },
};

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
  const resolvedRef = useRef(false);
  const duration = DURATION_MAP[button.durationScale];

  const complete = useCallback(
    (isCorrect: boolean) => {
      if (resolvedRef.current) {
        return;
      }

      resolvedRef.current = true;
      stopCountdownSound();
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
    playCountdownSound(button.durationScale);

    return () => {
      stopCountdownSound();
    };
  }, [button.durationScale]);

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
          className={cn(
            button.buttonVariant &&
              BUTTON_VARIANT_BG_CLASSES[button.buttonVariant].outer,
          )}
          faceClassName={cn(
            button.buttonVariant &&
              BUTTON_VARIANT_BG_CLASSES[button.buttonVariant].inner,
          )}
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
