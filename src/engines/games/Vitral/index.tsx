import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { Clock3, Coins, Puzzle } from 'lucide-react';
import { useState } from 'react';
import type { DailyVitralEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { PuzzleBoard } from './components/PuzzleBoard';
import { ResultsSplash } from './components/ResultsSplash';
import { getInitialState } from './utils/helpers';
import { VITRAL_TOTAL_HEARTS } from './utils/puzzleUtils';
import { useVitralEngine } from './utils/useVitralEngine';

/**
 * Props accepted by the {@link DailyVitralGame} component.
 */
type DailyVitralGameProps = {
  /**
   * Today's Vitral payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
};

function isDailyVitralEntry(
  data: PlaceholderGameData,
): data is DailyVitralEntry {
  return (
    data.type === 'vitral' &&
    typeof data.title === 'string' &&
    typeof data.cardId === 'string' &&
    Array.isArray(data.pieces) &&
    data.pieces.every((piece) => typeof piece === 'number')
  );
}

/**
 * Renders a full day of Vitral: timer-based puzzle assembly, connected
 * dragging, and a fullscreen results splash once the puzzle ends.
 *
 * @param props Today's Vitral payload.
 * @returns The rendered Vitral game.
 */
export function DailyVitralGame({ data }: DailyVitralGameProps) {
  if (!isDailyVitralEntry(data)) {
    throw new Error(
      'Invalid Vitral payload received from daily challenges API.',
    );
  }

  const [initialState] = useState(() => getInitialState(data));
  const {
    imageUrl,
    hearts,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    score,
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
      <GameStatsRow>
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

      <GameStatsRow>
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
        Você perde um coração a cada {20 + data.pieces.length} segundos.
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
