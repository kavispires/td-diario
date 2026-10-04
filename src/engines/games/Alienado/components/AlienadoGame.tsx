import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Gift } from 'lucide-react';
import { useMemo } from 'react';
import type { DailyAlienadoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  ALIENADO_CARD_WIDTH_CONFIG,
  ALIENADO_REQUEST_COUNT,
  ALIENADO_STATS_HEART_SIZE,
} from '../utils/constants';
import { splitGuess } from '../utils/helpers';
import type { GameState } from '../utils/types';
import { useAlienadoEngine } from '../utils/useAlienadoEngine';
import { AlienDictionary } from './AlienDictionary';
import { Board } from './Board';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link AlienadoGame} component.
 */
export type AlienadoGameProps = {
  /**
   * Today's Alienado payload, as resolved by `GameScreen`.
   */
  data: DailyAlienadoEntry;
  /**
   * Persisted per-day progress restored before the interactive engine mounts.
   */
  initialState: GameState;
};

/**
 * Renders Alienado's full interactive game experience using the already
 * restored persisted state from the wrapper component.
 *
 * @param props Daily challenge data and restored progress state.
 * @returns The rendered Alienado game.
 */
export function AlienadoGame({ data, initialState }: AlienadoGameProps) {
  const {
    hearts,
    guesses,
    selection,
    slotIndex,
    latestAttempt,
    isReady,
    isComplete,
    isWin,
    showResults,
    score,
    setShowResults,
    onSelectSlot,
    onSelectItem,
    onClearSlot,
    onDropItem,
    submitGuess,
  } = useAlienadoEngine(data, initialState);
  const previousGuesses = useMemo(() => guesses.map(splitGuess), [guesses]);
  const [itemWidth, containerRef] = useCardWidthByContainerRef(
    ALIENADO_REQUEST_COUNT * 2,
    ALIENADO_CARD_WIDTH_CONFIG,
  );

  // A short drag distance threshold lets regular taps fire instantly while
  // still recognizing an intentional drag gesture.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const itemId = active.data.current?.itemId as string | undefined;
    const source = active.data.current?.source as 'pool' | 'slot' | undefined;
    const sourceIndex = active.data.current?.index as number | undefined;
    const targetIndex = over?.data.current?.index as number | undefined;

    if (!itemId || !source || targetIndex === undefined) {
      return;
    }

    onDropItem(itemId, source, sourceIndex, targetIndex);
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col gap-4"
    >
      <GameStatsRow
        progress={isComplete ? 1 : guesses.length / data.requests.length}
        color={gameInfo.color}
      >
        <GameStat
          icon={Gift}
          value={'?'}
          label="Tentativas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={data.requests.length}
            size={ALIENADO_STATS_HEART_SIZE}
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
        title="Eu venho em paz"
        description={`Decifre os símbolos do alienígena, monte as ${ALIENADO_REQUEST_COUNT} entregas na ordem certa e envie tudo de uma vez.`}
      />

      <AlienDictionary
        attributes={data.attributes}
        itemWidth={itemWidth}
      />

      <div className="flex flex-col items-center gap-4">
        <SeeResultsButton
          isComplete={isComplete}
          setShowResults={setShowResults}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
      >
        <Board
          latestAttempt={latestAttempt}
          requests={data.requests}
          itemsIds={data.itemsIds}
          selection={selection}
          slotIndex={slotIndex}
          previousGuesses={previousGuesses}
          itemWidth={itemWidth}
          isReady={isReady}
          isComplete={isComplete}
          isWin={isWin}
          onSelectSlot={onSelectSlot}
          onSelectItem={onSelectItem}
          onClearSlot={onClearSlot}
          onSubmitGuess={submitGuess}
        />
      </DndContext>

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          requests={data.requests}
          attributes={data.attributes}
          guesses={previousGuesses}
          solution={data.solution}
          score={score}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
