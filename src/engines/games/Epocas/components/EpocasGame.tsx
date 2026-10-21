import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { CheckCircle2, Coins } from 'lucide-react';
import type { DailyEpocasEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  EPOCAS_HEART_ICON_SIZE,
  EPOCAS_TOTAL_HEARTS,
} from '../utils/constants';
import type { GameState } from '../utils/types';
import { useEpocasEngine } from '../utils/useEpocasEngine';
import { AttemptsHistory } from './AttemptsHistory';
import { ResultsSplash } from './ResultsSplash';
import { Timeline } from './Timeline';

/**
 * Props accepted by the {@link EpocasGame} component.
 */
export type EpocasGameProps = {
  /**
   * Dynamic payload resolved by `GameScreen` for today's Épocas route.
   */
  data: DailyEpocasEntry;
  /**
   * Restored or freshly built engine state for today's Épocas session.
   */
  initialState: GameState;
};

/**
 * Renders the full Épocas game body from a prepared initial state.
 *
 * @param props Today's Épocas payload and restored state.
 * @returns The rendered game UI.
 */
export function EpocasGame({ data, initialState }: EpocasGameProps) {
  const {
    hearts,
    order,
    attempts,
    selectedIndex,
    latestAttempt,
    score,
    progress,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    onSwap,
    onMove,
    onSelectForSwap,
    onVerify,
  } = useEpocasEngine(data, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={CheckCircle2}
          value={`${attempts.length}`}
          label="Tentativas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={EPOCAS_TOTAL_HEARTS}
            size={EPOCAS_HEART_ICON_SIZE}
          />
        </div>

        <GameStat
          icon={Coins}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <GameTitle
        title="Quando é que isso aconteceu?"
        description="Arraste os eventos para colocá-los em ordem cronológica."
      />

      <Timeline
        events={data.events}
        order={order}
        selectedIndex={selectedIndex}
        latestAttempt={latestAttempt}
        isComplete={isComplete}
        onSwap={onSwap}
        onMove={onMove}
        onSelectForSwap={onSelectForSwap}
      />

      {!isComplete && (
        <Button
          variant="primary"
          size="small"
          onClick={onVerify}
        >
          Verificar
        </Button>
      )}

      <AttemptsHistory
        attempts={attempts}
        totalEvents={data.events.length}
      />

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          score={score}
          attempts={attempts}
          challengeNumber={data.number}
          events={data.events}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
