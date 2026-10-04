import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Crosshair } from 'lucide-react';
import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import type { DailyPirralhosEntry } from 'types/games';
import { gameInfo } from '../info';
import { KIDS_LIBRARY, PIRRALHOS_TOTAL_HEARTS } from '../utils/constants';
import {
  calculateEllipsePositions,
  getEllipseHeight,
  getLiarsCountLabel,
  getLiarsLabel,
  getOverlapSafeEllipseHeight,
} from '../utils/helpers';
import type { GameState } from '../utils/types';
import { usePirralhosEngine } from '../utils/usePirralhosEngine';
import { KidCard } from './KidCard';
import { PirralhosIcon, PirralhosIconDefs } from './PirralhosIcon';
import { ResultsSplash } from './ResultsSplash';
import { SolveModal } from './SolveModal';

/**
 * Props accepted by the {@link PirralhosGame} component.
 */
export type PirralhosGameProps = {
  /**
   * Today's Pirralhos payload, as resolved by `GameScreen`.
   */
  data: DailyPirralhosEntry;
  /**
   * Persisted starting snapshot derived from today's challenge payload.
   */
  initialState: GameState;
};

/**
 * Renders the complete Pirralhos gameplay flow for a single daily challenge.
 *
 * @param props Today's Pirralhos payload and its derived starting state.
 * @returns The rendered Pirralhos game.
 */
export function PirralhosGame({ data, initialState }: PirralhosGameProps) {
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

  // Tracks each rendered kid card's actual height so the ellipse container
  // can grow to fit long statements/names without stacked cards overlapping.
  const [cardHeights, setCardHeights] = useState<Record<number, number>>({});
  const cardObserversRef = useRef(new Map<number, ResizeObserver>());
  const cardRefCallbacksRef = useRef(
    new Map<number, (node: HTMLDivElement | null) => void>(),
  );
  const observeCard = useCallback((index: number) => {
    const cached = cardRefCallbacksRef.current.get(index);
    if (cached) {
      return cached;
    }

    const callback = (node: HTMLDivElement | null) => {
      const observers = cardObserversRef.current;
      observers.get(index)?.disconnect();

      if (!node) {
        observers.delete(index);
        return;
      }

      const observer = new ResizeObserver(([entry]) => {
        const height = entry?.contentRect.height;
        if (height) {
          setCardHeights((previous) =>
            previous[index] === height
              ? previous
              : { ...previous, [index]: height },
          );
        }
      });
      observer.observe(node);
      observers.set(index, observer);
    };

    cardRefCallbacksRef.current.set(index, callback);
    return callback;
  }, []);
  const maxCardHeight = useMemo(
    () => Math.max(0, ...Object.values(cardHeights)),
    [cardHeights],
  );

  const ellipseHeight = getOverlapSafeEllipseHeight(
    getEllipseHeight(data.kids.length, cardWidth),
    positions,
    maxCardHeight,
  );

  return (
    <>
      <PirralhosIconDefs />

      <div
        ref={containerRef}
        className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
      >
        <GameStatsRow
          progress={isComplete ? 1 : progress}
          color={gameInfo.color}
        >
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

        <GameTitle title="Quem pegou o brinquedo?" />

        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          <Pill size="small">
            <PirralhosIcon
              icon="guilty"
              size={14}
            />
            1 Culpado
          </Pill>
          <Pill size="small">
            <PirralhosIcon
              icon="liar"
              size={14}
            />
            {liarsCountLabel} {liarsLabel}
          </Pill>
        </div>

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
            marginTop: cardWidth / 1.25,
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
                  ref={observeCard(index)}
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
                  className="absolute"
                  style={{
                    left: `${arrowX}%`,
                    top: `${arrowY}%`,
                    transform: `translate(-50%, -50%) rotate(${position.angle}deg)`,
                    zIndex: 40,
                  }}
                >
                  <PirralhosIcon
                    icon="arrow"
                    size={24}
                  />
                </div>
              </Fragment>
            );
          })}
        </div>

        <Surface className="flex w-full flex-col items-center gap-2 bg-card px-5 py-4 text-center">
          <Text className="text-sm leading-relaxed text-subtle-foreground">
            Você pode clicar no botão{' '}
            <PirralhosIcon
              icon="unknown"
              size={16}
              className="inline-block align-text-bottom"
            />{' '}
            em cada criança pra marcá-las como culpada{' '}
            <PirralhosIcon
              icon="guilty"
              size={16}
              className="inline-block align-text-bottom"
            />
            , mentirosa{' '}
            <PirralhosIcon
              icon="liar"
              size={16}
              className="inline-block align-text-bottom"
            />{' '}
            ou inocente{' '}
            <PirralhosIcon
              icon="innocent"
              size={16}
              className="inline-block align-text-bottom"
            />
            .{' '}
            <button
              type="button"
              onClick={resetAssessments}
              className="font-semibold text-secondary underline underline-offset-2"
            >
              Limpar tudo
            </button>
          </Text>
        </Surface>

        <SeeResultsButton
          isComplete={isComplete}
          setShowResults={setShowResults}
        />
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
