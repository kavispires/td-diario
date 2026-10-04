import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Repeat } from 'lucide-react';
import type { DailyOrganikuEntry } from '../../../../types/games';
import { gameInfo } from '../info';
import type { GameState } from '../utils/types';
import { useOrganikuEngine } from '../utils/useOrganikuEngine';
import { CompletionTracker } from './CompletionTracker';
import { ResultsSplash } from './ResultsSplash';
import { TableGrid } from './TableGrid';

/**
 * Props accepted by the {@link OrganikuGame} component.
 */
export type OrganikuGameProps = {
  /**
   * Today's Organiku payload, as resolved by `GameScreen`.
   */
  data: DailyOrganikuEntry;
  /**
   * Initial persisted state restored for today's challenge.
   */
  initialState: GameState;
};

/**
 * Renders the full Organiku gameplay experience using an already-prepared
 * initial state.
 *
 * @param props Today's Organiku payload and restored initial state.
 * @returns The rendered Organiku game.
 */
export function OrganikuGame({ data, initialState }: OrganikuGameProps) {
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
    progress,
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
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
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

      <GameTitle
        title={data.title}
        description={
          <>
            Revele itens de par em par.
            <br />
            Há apenas um tipo de símbolo por linha e coluna.
          </>
        }
      />

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

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

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
          score={score}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
