import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Surface } from '@components/ui/Surface';
import { Tooltip } from '@components/ui/Tooltip';
import { Text } from '@components/ui/Typography';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Check, Coins, Star } from 'lucide-react';
import { useState } from 'react';
import type { DailyConjuntosEntry, DailyConjuntosThing } from 'types/games';
import { Diagram } from './components/Diagram';
import { GrammarRulesModal } from './components/GrammarRulesModal';
import { HandThing } from './components/HandThing';
import { InDiagramThings } from './components/InDiagramThings';
import { PlacementReview } from './components/PlacementReview';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import {
  CONJUNTOS_DIAGRAM_THING_WIDTH_MULTIPLIER,
  CONJUNTOS_HAND_CARD_COLUMNS,
  CONJUNTOS_HAND_CARD_GAP,
  CONJUNTOS_HAND_CARD_MARGIN,
  CONJUNTOS_HAND_CARD_MAX_WIDTH,
  CONJUNTOS_HAND_CARD_MIN_WIDTH,
  CONJUNTOS_INTERSECTION_THING_WIDTH_MULTIPLIER,
  CONJUNTOS_MAX_DIFFICULTY_LEVEL,
  CONJUNTOS_MIN_DIFFICULTY_LEVEL,
} from './utils/constants';
import { getInitialState } from './utils/helpers';
import type { DiagramArea } from './utils/types';
import { useConjuntosEngine } from './utils/useConjuntosEngine';

/**
 * Props accepted by the {@link DailyConjuntosGame} component.
 */
type DailyConjuntosGameProps = {
  /**
   * Today's Conjuntos payload, as resolved by `GameScreen`.
   */
  data: DailyConjuntosEntry;
};

/**
 * Renders a full day of Conjuntos: title/difficulty, the interactive
 * diagram, the current hand of things, and a fullscreen results splash
 * once the puzzle ends in a win or loss.
 *
 * @param props Today's Conjuntos payload.
 * @returns The rendered Conjuntos game.
 */
export function DailyConjuntosGame({ data }: DailyConjuntosGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    hearts,
    maxHearts,
    hand,
    rule1Things,
    rule2Things,
    intersectingThings,
    guesses,
    placedThingsCount,
    progress,
    score,
    activeThing,
    activeArea,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    onSelectThing,
    onSelectArea,
    onDropThing,
    onConfirmPlacement,
    onCancelPlacement,
  } = useConjuntosEngine(data, initialState);
  const [thingWidth, containerRef] = useCardWidthByContainerRef(
    CONJUNTOS_HAND_CARD_COLUMNS,
    {
      margin: CONJUNTOS_HAND_CARD_MARGIN,
      gap: CONJUNTOS_HAND_CARD_GAP,
      maxWidth: CONJUNTOS_HAND_CARD_MAX_WIDTH,
      minWidth: CONJUNTOS_HAND_CARD_MIN_WIDTH,
    },
  );
  const difficultyStars = Array.from({
    length: Math.max(data.level, CONJUNTOS_MIN_DIFFICULTY_LEVEL),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  /**
   * Resolves a drag-and-drop gesture into an `onDropThing` call once a hand
   * thing is released over one of the diagram's droppable areas.
   *
   * @param event - The dnd-kit drag end event.
   */
  function handleDragEnd(event: DragEndEvent) {
    const thing = event.active.data.current?.thing as
      | DailyConjuntosThing
      | undefined;
    const area = event.over?.data.current?.area as DiagramArea | undefined;

    if (thing && area !== undefined) {
      onDropThing(thing, area);
    }
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
    >
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Check}
          value={`${placedThingsCount}/${maxHearts}`}
          label="Coisas colocadas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={maxHearts}
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
        description="Descubra as duas regras escondidas e encaixe cada coisa na região
          certa do diagrama."
      />

      <div className="flex flex-col items-center gap-2 text-center">
        <Tooltip title="Dificuldade do jogo">
          <div
            className="flex items-center gap-1"
            role="img"
            aria-label={`Dificuldade ${data.level} de ${CONJUNTOS_MAX_DIFFICULTY_LEVEL}`}
          >
            {difficultyStars.map((_, index) => (
              <Star
                key={index}
                className="h-4 w-4 fill-gold text-gold"
                aria-hidden="true"
              />
            ))}
          </div>
        </Tooltip>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
      >
        <Diagram
          className="w-full"
          activeArea={activeArea}
          onSelectArea={onSelectArea}
          disabled={isComplete}
          leftCircleChildren={
            <InDiagramThings
              things={rule1Things}
              width={thingWidth * CONJUNTOS_DIAGRAM_THING_WIDTH_MULTIPLIER}
            />
          }
          rightCircleChildren={
            <InDiagramThings
              things={rule2Things}
              width={thingWidth * CONJUNTOS_DIAGRAM_THING_WIDTH_MULTIPLIER}
            />
          }
          intersectionChildren={
            <InDiagramThings
              things={intersectingThings}
              width={
                thingWidth *
                CONJUNTOS_DIAGRAM_THING_WIDTH_MULTIPLIER *
                CONJUNTOS_INTERSECTION_THING_WIDTH_MULTIPLIER
              }
            />
          }
        />

        <Surface className="w-full bg-surface px-4 py-4 text-center">
          <Text className="text-center block mb-2">
            Selecione uma coisa e coloque na área correta:
          </Text>

          {activeThing && activeArea !== null && !isComplete && (
            <PlacementReview
              activeThing={activeThing}
              activeArea={activeArea}
              rule1Things={rule1Things}
              rule2Things={rule2Things}
              intersectingThings={intersectingThings}
              onCancel={onCancelPlacement}
              onConfirm={onConfirmPlacement}
              thingWidth={thingWidth}
            />
          )}

          <div className="flex w-full flex-wrap justify-center gap-3">
            {hand.map((thing) => (
              <HandThing
                key={thing.id}
                thing={thing}
                isActive={activeThing?.id === thing.id}
                width={thingWidth}
                onSelect={() => onSelectThing(thing)}
                disabled={isComplete}
              />
            ))}
          </div>
        </Surface>
      </DndContext>

      <GrammarRulesModal />

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {showResults && (
        <ResultsSplash
          data={data}
          win={isWin}
          hearts={hearts}
          maxHearts={maxHearts}
          score={score}
          guesses={guesses}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
