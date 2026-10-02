import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { LoaderCircle, Skull, Trophy } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  PANICO_PROCESSING_DELAY_MS,
  PANICO_START_DELAY_MS,
} from '../utils/helpers';
import type { ButtonEntry } from '../utils/types';
import { ButtonPuzzle } from './ButtonPuzzle';

/**
 * Props accepted by {@link Panel}.
 */
type PanelProps = {
  /**
   * Index of the active button in today's sequence.
   */
  activeButtonIndex: number;
  /**
   * Whether the sequence is idle or currently running.
   */
  sessionStatus: 'idle' | 'ongoing';
  /**
   * Whether the game has already ended.
   */
  isComplete: boolean;
  /**
   * Whether the completed game ended in a win.
   */
  isWin: boolean;
  /**
   * Resolved Panico button sequence.
   */
  buttons: ButtonEntry[];
  /**
   * Called after the current puzzle is judged.
   */
  onNextButton: (isCorrect: boolean) => void;
  /**
   * Starts a new run from the first button.
   */
  onStart: () => void;
  /**
   * Width/height available for the puzzle ring.
   */
  size: number;
};

/**
 * Renders Panico's central panel, including the start state, the active
 * button puzzle, interstitial processing delays, and the completed state.
 *
 * @param props Panel state, actions, resolved buttons, and layout size.
 * @returns The rendered central game panel.
 */
export function Panel({
  activeButtonIndex,
  sessionStatus,
  isComplete,
  isWin,
  buttons,
  onNextButton,
  onStart,
  size,
}: PanelProps) {
  const [phase, setPhase] = useState<'idle' | 'processing' | 'active'>('idle');
  const timeoutRef = useRef<number | null>(null);
  const activeButton = useMemo(
    () => buttons[activeButtonIndex],
    [buttons, activeButtonIndex],
  );

  useEffect(() => {
    if (isComplete || sessionStatus === 'idle') {
      setPhase('idle');
    }
  }, [isComplete, sessionStatus]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleStart() {
    setPhase('processing');
    timeoutRef.current = window.setTimeout(() => {
      onStart();
      setPhase('active');
    }, PANICO_START_DELAY_MS);
  }

  function handleComplete(isCorrect: boolean) {
    setPhase('processing');
    timeoutRef.current = window.setTimeout(() => {
      onNextButton(isCorrect);
      setPhase('active');
    }, PANICO_PROCESSING_DELAY_MS);
  }

  if (isComplete) {
    return (
      <div className="grid min-h-72 w-full place-items-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
        {isWin ? (
          <Trophy
            className="h-24 w-24 text-gold"
            aria-hidden="true"
          />
        ) : (
          <Skull
            className="h-24 w-24 text-destructive"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }

  if (phase === 'processing') {
    return (
      <div className="grid min-h-72 w-full place-items-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
        <LoaderCircle
          className="h-16 w-16 animate-spin text-gold"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (sessionStatus === 'idle') {
    return (
      <div className="grid min-h-72 w-full place-items-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Text className="max-w-64 text-sm text-slate-200">
            Aguarde o processamento e siga cada instrução antes que o tempo
            acabe. Errou? Você perde um coração e volta ao começo.
          </Text>
          <Button
            variant="primary"
            size="small"
            onClick={handleStart}
          >
            Iniciar
          </Button>
        </div>
      </div>
    );
  }

  if (!activeButton) {
    return (
      <div className="grid min-h-72 w-full place-items-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
        <LoaderCircle
          className="h-16 w-16 animate-spin text-gold"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="grid min-h-72 w-full place-items-center rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
      <ButtonPuzzle
        key={activeButton.id}
        button={activeButton}
        onComplete={handleComplete}
        size={size}
      />
    </div>
  );
}
