import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Award, Gauge } from 'lucide-react';
import type { DailyPanicoEntry } from 'types/games';
import { gameInfo } from '../info';
import { PANICO_TOTAL_HEARTS } from '../utils/constants';
import type { GameState } from '../utils/types';
import { usePanicoEngine } from '../utils/usePanicoEngine';
import { Panel } from './Panel';
import { ResultsSplash } from './ResultsSplash';
import { SoundSfxAlert } from './SoundSfxAlert';

/**
 * Props accepted by {@link PanicoGame}.
 */
export type PanicoGameProps = {
  /**
   * Today's Panico payload resolved by the shared game screen.
   */
  data: DailyPanicoEntry;
  /**
   * Persisted progress restored before the interactive run starts.
   */
  initialState: GameState;
};

/**
 * Renders the full interactive Panico experience using the resolved daily data
 * and restored progress state.
 *
 * @param props Today's Panico payload and restored progress.
 * @returns The rendered Panico game.
 */
export function PanicoGame({ data, initialState }: PanicoGameProps) {
  const {
    hearts,
    totalButtons,
    farthestButtonIndex,
    score,
    progress,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    activeButtonIndex,
    sessionStatus,
    buttons,
    onStart,
    onNextButton,
  } = usePanicoEngine(data, initialState);
  const [panelSize, containerRef] = useCardWidthByContainerRef(1, {
    margin: 0,
    gap: 0,
    maxWidth: 360,
    minWidth: 280,
  });

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4"
    >
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Gauge}
          value={`${Math.max(farthestButtonIndex, 0)}/${totalButtons}`}
          label="Sequência"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={PANICO_TOTAL_HEARTS}
            size={16}
          />
        </div>

        <GameStat
          icon={Award}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <Text className="text-center text-sm text-slate-200">
        Siga as instruções de quando e como apertar o botão. Aperte “Iniciar”
        para começar e boa sorte! Progresso salvo hoje:{' '}
        <strong>{Math.round(progress * 100)}%</strong>.
      </Text>

      <SoundSfxAlert />

      <Panel
        activeButtonIndex={activeButtonIndex}
        sessionStatus={sessionStatus}
        isComplete={isComplete}
        isWin={isWin}
        buttons={buttons}
        onNextButton={onNextButton}
        onStart={onStart}
        size={panelSize}
      />

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          farthestButtonIndex={farthestButtonIndex}
          totalButtons={totalButtons}
          score={score}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
