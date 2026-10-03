import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Repeat } from 'lucide-react';
import { useState } from 'react';
import type { DailyOrganikuEntry } from '../../../types/games';
import { CompletionTracker } from './components/CompletionTracker';
import { ResultsSplash } from './components/ResultsSplash';
import { TableGrid } from './components/TableGrid';
import { getInitialState } from './utils/helpers';
import { useOrganikuEngine } from './utils/useOrganikuEngine';

/**
 * Props accepted by the {@link DailyOrganikuGame} component.
 */
type DailyOrganikuGameProps = {
  /**
   * Today's Organiku payload, as resolved by `GameScreen`.
   */
  data: DailyOrganikuEntry;
};

/**
 * Renders a full day of Organiku: the memory-match grid, its completion
 * tracker, and a results splash once the game ends in a win or loss.
 *
 * @param props Today's Organiku payload.
 * @returns The rendered Organiku game.
 */
export function DailyOrganikuGame({ data }: DailyOrganikuGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    hearts,
    revealed,
    activeTileIndex,
    pairActiveTileIndex,
    foundCount,
    onActivateTile,
    flips,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    tracker,
    score,
  } = useOrganikuEngine(data, initialState);
  const [itemWidth, containerRef] = useCardWidthByContainerRef(5, {
    margin: 48,
    gap: 12,
    maxWidth: 96,
    minWidth: 55,
  });

  const swapLimit = data.grid.length - data.defaultRevealedIndexes.length;
  const gridSize = Math.sqrt(data.grid.length);

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4"
    >
      <GameStatsRow>
        <GameStat
          icon={Repeat}
          value={`${flips}/${swapLimit}`}
          label="Viradas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={data.itemsIds.length}
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

      <div className="flex w-full items-center justify-center">
        <Text strong>{data.title}</Text>
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        Revele itens de par em par.
        <br />
        Há apenas um tipo de símbolo por linha e coluna.
      </Text>

      <TableGrid
        grid={data.grid}
        revealed={revealed}
        activeTileIndex={activeTileIndex}
        pairActiveTileIndex={pairActiveTileIndex}
        onSelectTile={isComplete ? () => {} : onActivateTile}
        foundCount={foundCount}
        itemWidth={itemWidth}
        defaultRevealedIndexes={data.defaultRevealedIndexes}
      />

      <CompletionTracker
        itemsIds={data.itemsIds}
        tracker={tracker}
        itemWidth={itemWidth}
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
          itemsIds={data.itemsIds}
          title={data.title}
          foundCount={foundCount}
          gridSize={gridSize}
          flips={flips}
          swapLimit={swapLimit}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
