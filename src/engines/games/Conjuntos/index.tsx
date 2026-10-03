import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Check, Coins, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { DailyConjuntosEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { Diagram } from './components/Diagram';
import { InDiagramThings } from './components/InDiagramThings';
import { PlacementReview } from './components/PlacementReview';
import { ResultsSplash } from './components/ResultsSplash';
import { ThingCard } from './components/ThingCard';
import { getInitialState } from './utils/helpers';
import { useConjuntosEngine } from './utils/useConjuntosEngine';

/**
 * Props accepted by the {@link DailyConjuntosGame} component.
 */
type DailyConjuntosGameProps = {
  /**
   * Today's Conjuntos payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
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
  const conjuntosData = data as DailyConjuntosEntry;
  const [initialState] = useState(() => getInitialState(conjuntosData));
  const {
    hearts,
    maxHearts,
    hand,
    rule1Things,
    rule2Things,
    intersectingThings,
    guesses,
    placedThingsCount,
    totalThings,
    progress,
    score,
    isWeekend,
    activeThing,
    activeArea,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    onSelectThing,
    onSelectArea,
    onConfirmPlacement,
    onCancelPlacement,
  } = useConjuntosEngine(conjuntosData, initialState);
  const [thingWidth, containerRef] = useCardWidthByContainerRef(5, {
    margin: 48,
    gap: 12,
    maxWidth: 82,
    minWidth: 54,
  });
  const difficultyStars = Array.from({
    length: Math.max(conjuntosData.level, 1),
  });

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
    >
      <GameStatsRow>
        <GameStat
          icon={Check}
          value={`${placedThingsCount}/${totalThings}`}
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

      <div className="flex flex-col items-center gap-2 text-center">
        <Pill>Desafio #{conjuntosData.number}</Pill>

        <Title
          level={3}
          className="uppercase"
        >
          {conjuntosData.title}
        </Title>

        <div
          className="flex items-center gap-1"
          role="img"
          aria-label={`Dificuldade ${conjuntosData.level} de 5`}
        >
          {difficultyStars.map((_, index) => (
            <Star
              key={index}
              className="h-4 w-4 fill-gold text-gold"
              aria-hidden="true"
            />
          ))}
        </div>

        <Text
          type="secondary"
          className="text-center"
        >
          Descubra as duas regras escondidas e encaixe cada coisa na região
          certa do diagrama.
        </Text>
      </div>

      {!isComplete && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
      )}

      <Diagram
        className="w-full"
        activeArea={activeArea}
        onSelectArea={onSelectArea}
        disabled={!activeThing || isComplete}
        leftCircleChildren={
          <InDiagramThings
            things={rule1Things}
            width={thingWidth}
          />
        }
        rightCircleChildren={
          <InDiagramThings
            things={rule2Things}
            width={thingWidth}
          />
        }
        intersectionChildren={
          <InDiagramThings
            things={intersectingThings}
            width={thingWidth * 0.95}
          />
        }
      />

      <Text
        type="secondary"
        className="text-center"
      >
        {isComplete
          ? 'O diagrama de hoje já está resolvido. Abra o resultado para rever as regras.'
          : 'Escolha uma coisa da sua mão e depois toque na área onde ela deve ficar.'}
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
        {hand.map((thing) => {
          const isActive = activeThing?.id === thing.id;

          return (
            <button
              key={thing.id}
              type="button"
              className={`rounded-3xl border-2 px-3 py-3 transition ${
                isActive
                  ? 'border-secondary bg-secondary-soft'
                  : 'border-transparent bg-card hover:border-border-strong'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
              onClick={() => onSelectThing(thing)}
              disabled={isComplete}
              aria-pressed={isActive}
              aria-label={`Selecionar ${thing.name}`}
            >
              <ThingCard
                itemId={thing.id}
                name={thing.name}
                width={thingWidth}
              />
            </button>
          );
        })}
      </div>

      <Surface className="w-full bg-card px-5 py-5 text-center">
        <Text
          strong
          className="block"
        >
          Dica de leitura
        </Text>
        <Text
          type="secondary"
          className="mt-2 block"
        >
          O título aponta a família das regras gramaticais escondidas. Quanto
          mais estrelas, mais traiçoeiras ficam as pistas.
          {isWeekend ? ' Hoje o desafio usa a versão de fim de semana.' : ''}
        </Text>
      </Surface>

      {isComplete && !showResults && (
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowResults(true)}
        >
          Ver resultado
        </Button>
      )}

      {showResults && (
        <ResultsSplash
          data={conjuntosData}
          win={isWin}
          hearts={hearts}
          maxHearts={maxHearts}
          score={score}
          guesses={guesses}
          challengeNumber={conjuntosData.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
