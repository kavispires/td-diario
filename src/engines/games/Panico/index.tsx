import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Award, Gauge } from 'lucide-react';
import { useState } from 'react';
import type { DailyPanicoEntry } from 'types/games';
import { Panel } from './components/Panel';
import { ResultsSplash } from './components/ResultsSplash';
import { SoundSfxAlert } from './components/SoundSfxAlert';
import { gameInfo } from './info';
import { PANICO_TOTAL_HEARTS } from './utils/constants';
import { getInitialState } from './utils/helpers';
import { usePanicoEngine } from './utils/usePanicoEngine';

/**
 * Props accepted by {@link DailyPanicoGame}.
 */
type DailyPanicoGameProps = {
  /**
   * Today's Panico payload resolved by the shared game screen.
   */
  data: DailyPanicoEntry;
};

/**
 * Renders a full Panico run: instructions, timed button sequence, and the
 * fullscreen results splash shown on win/loss.
 *
 * @param props Today's Panico payload.
 * @returns The rendered Panico game.
 */
export function DailyPanicoGame({ data }: DailyPanicoGameProps) {
  const [initialState] = useState(() => getInitialState(data));
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

      {isComplete && !showResults && (
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowResults(true)}
        >
          Ver resultado
        </Button>
      )}

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
