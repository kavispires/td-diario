import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { ArrowRight, Coins, Crosshair } from 'lucide-react';
import { Fragment, useMemo, useState } from 'react';
import type { DailyPirralhosEntry } from 'types/games';
import { KidCard } from './components/KidCard';
import { ResultsSplash } from './components/ResultsSplash';
import { SolveModal } from './components/SolveModal';
import { gameInfo } from './info';
import { KIDS_LIBRARY, PIRRALHOS_TOTAL_HEARTS } from './utils/constants';
import {
  calculateEllipsePositions,
  getEllipseHeight,
  getInitialState,
  getLiarsCountLabel,
  getLiarsLabel,
} from './utils/helpers';
import { usePirralhosEngine } from './utils/usePirralhosEngine';

/**
 * Props accepted by the {@link DailyPirralhosGame} component.
 */
type DailyPirralhosGameProps = {
  /**
   * Today's Pirralhos payload, as resolved by `GameScreen`.
   */
  data: DailyPirralhosEntry;
};

/**
 * Renders a full day of Pirralhos: kid statements arranged around the
 * accusation circle, note markers, the suspect picker, and a fullscreen
 * results splash once the mystery ends in a win or loss.
 *
 * @param props Today's Pirralhos payload.
 * @returns The rendered Pirralhos game.
 */
export function DailyPirralhosGame({ data }: DailyPirralhosGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const [solveModalOpen, setSolveModalOpen] = useState(false);
  const {
    hearts,
    guesses,
    assessments,
    showResults,
    setShowResults,
    progress,
    score,
    isWin,
    isComplete,
    assessKid,
    resetAssessments,
    submitKid,
  } = usePirralhosEngine(data, initialState);
  const [cardWidth, containerRef] = useCardWidthByContainerRef(3, {
    margin: 16,
    gap: 8,
    maxWidth: 152,
    minWidth: 68,
  });

  const positions = useMemo(
    () => calculateEllipsePositions(data.kids.length),
    [data.kids.length],
  );
  const liarsCountLabel = useMemo(
    () => getLiarsCountLabel(data.liarsIds, data.possibleLiars),
    [data.liarsIds, data.possibleLiars],
  );
  const liarsLabel = useMemo(
    () => getLiarsLabel(data.liarsIds, data.possibleLiars),
    [data.liarsIds, data.possibleLiars],
  );
  const ellipseHeight = getEllipseHeight(data.kids.length, cardWidth);

  return (
    <>
      <div
        ref={containerRef}
        className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
      >
        <GameStatsRow>
          <GameStat
            icon={Crosshair}
            value={`${guesses.length}/${PIRRALHOS_TOTAL_HEARTS}`}
            label="Acusações"
          />

          <div className="flex items-center justify-center">
            <Hearts
              remaining={hearts}
              total={PIRRALHOS_TOTAL_HEARTS}
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
          <Pill>Desafio #{data.number}</Pill>
          <Title level={3}>{gameInfo.name.pt}</Title>
          <Text type="secondary">
            Escute cada pirralho, marque suas suspeitas e descubra quem pegou o
            brinquedo.
          </Text>
        </div>

        {!isComplete && (
          <div className="h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-200 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          <Pill>1 Culpado</Pill>
          <Pill>
            {liarsCountLabel} {liarsLabel}
          </Pill>
        </div>

        <Text
          type="secondary"
          className="text-center"
        >
          Toque no ícone de cada criança para marcar suspeitas. Quando quiser,
          abra a acusação e escolha um nome.
        </Text>

        {!isComplete && (
          <Button
            variant="primary"
            size="small"
            icon={<Crosshair />}
            onClick={() => setSolveModalOpen(true)}
          >
            Resolver
          </Button>
        )}

        <div
          className="relative w-full"
          style={{
            marginTop: cardWidth / 1.85,
            height: ellipseHeight,
          }}
        >
          {data.kids.map((kidEntry, index) => {
            const kid = KIDS_LIBRARY[kidEntry.kidId];
            const position = positions[index];
            const nextPosition = positions[(index + 1) % data.kids.length];
            const arrowX = (position.x + nextPosition.x) / 2;
            const arrowY = (position.y + nextPosition.y) / 2;

            if (!kid) {
              return null;
            }

            return (
              <Fragment key={`kid-${kidEntry.kidId}-${index}`}>
                <div
                  className="absolute"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                  }}
                >
                  <KidCard
                    kidEntry={kidEntry}
                    kid={kid}
                    index={index}
                    width={cardWidth}
                    assessment={assessments[kidEntry.kidId] ?? 'unknown'}
                    onAssess={assessKid}
                    onOpenSolve={
                      !isComplete ? () => setSolveModalOpen(true) : undefined
                    }
                  />
                </div>

                <div
                  className="absolute text-primary/60"
                  style={{
                    left: `${arrowX}%`,
                    top: `${arrowY}%`,
                    transform: `translate(-50%, -50%) rotate(${position.angle}deg)`,
                    zIndex: 10,
                  }}
                >
                  <ArrowRight
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </div>
              </Fragment>
            );
          })}
        </div>

        <Surface className="flex w-full flex-col items-center gap-3 bg-card px-5 py-5 text-center">
          <Text className="text-sm leading-relaxed text-subtle-foreground">
            Use as marcações para separar quem parece culpado, quem parece
            mentir e quem parece inocente. Elas são só anotações suas e não
            interferem no resultado final.
          </Text>

          <Button
            variant="outlined"
            size="small"
            onClick={resetAssessments}
          >
            Limpar tudo
          </Button>
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
      </div>

      <SolveModal
        open={solveModalOpen}
        onClose={() => setSolveModalOpen(false)}
        kids={data.kids}
        guesses={guesses}
        onResolve={submitKid}
      />

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          challengeNumber={data.number}
          score={score}
          culpritId={data.culpritId}
          liarsIds={data.liarsIds}
          kids={data.kids}
          onClose={() => setShowResults(false)}
        />
      )}
    </>
  );
}
