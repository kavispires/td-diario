import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Text } from '@components/ui/Typography';
import { Clock3, Coins, Puzzle } from 'lucide-react';
import { useState } from 'react';
import type { DailyVitralEntry } from 'types/games';
import { PuzzleBoard } from './components/PuzzleBoard';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import {
  HEART_LOSS_INTERVAL_SECONDS,
  VITRAL_TOTAL_HEARTS,
} from './utils/constants';
import { getInitialState } from './utils/helpers';
import { useVitralEngine } from './utils/useVitralEngine';

/**
 * Props accepted by the {@link DailyVitralGame} component.
 */
type DailyVitralGameProps = {
  /**
   * Today's Vitral payload, as resolved by `GameScreen`.
   */
  data: DailyVitralEntry;
};

/**
 * Renders a full day of Vitral: timer-based puzzle assembly, connected
 * dragging, and a fullscreen results splash once the puzzle ends.
 *
 * @param props Today's Vitral payload.
 * @returns The rendered Vitral game.
 */
export function DailyVitralGame({ data }: DailyVitralGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    imageUrl,
    hearts,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    score,
    progress,
    time,
    totalTime,
    measures,
    boardRef,
    startDrag,
    grid,
    activeDrag,
    activeGroupSlotIndexes,
    targetGroupSlotIndexes,
    hiddenPieceIds,
    getBorders,
    correctPieces,
  } = useVitralEngine(data, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 pb-4">
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Puzzle}
          value={`${correctPieces}/${data.pieces.length}`}
          label="Peças corretas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={VITRAL_TOTAL_HEARTS}
            size={16}
          />
        </div>

        <GameStat
          icon={Coins}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <GameStatsRow
        progress={
          isComplete
            ? 1
            : Math.min(
                1,
                totalTime /
                  (VITRAL_TOTAL_HEARTS *
                    (HEART_LOSS_INTERVAL_SECONDS + data.pieces.length)),
              )
        }
        color={gameInfo.color}
      >
        <div />
        <GameStat
          icon={Clock3}
          value={time}
          label="Tempo decorrido"
          align="center"
        />
        <div />
      </GameStatsRow>

      <div className="flex w-full items-center justify-center">
        <Text strong>{data.title}</Text>
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        Arraste uma peça para perto de outra que combine para grudá-las.
        <br />
        Você perde um coração a cada{' '}
        {HEART_LOSS_INTERVAL_SECONDS + data.pieces.length} segundos.
      </Text>

      <PuzzleBoard
        imageUrl={imageUrl}
        grid={grid}
        measures={measures}
        isComplete={isComplete}
        isWin={isWin}
        activeGroupSlotIndexes={activeGroupSlotIndexes}
        targetGroupSlotIndexes={targetGroupSlotIndexes}
        hiddenPieceIds={hiddenPieceIds}
        activeDrag={activeDrag}
        boardRef={boardRef}
        getBorders={getBorders}
        startDrag={(index, event) =>
          startDrag(index, event.nativeEvent.clientX, event.nativeEvent.clientY)
        }
      />

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {isComplete && showResults && (
        <ResultsSplash
          data={data}
          win={isWin}
          hearts={hearts}
          challengeNumber={data.number}
          totalTime={totalTime}
          score={score}
          correctPieces={correctPieces}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
