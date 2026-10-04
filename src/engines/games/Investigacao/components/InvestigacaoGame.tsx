import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { Popconfirm } from '@components/ui/Popconfirm';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Heart, UserRoundCheck } from 'lucide-react';
import { useMemo } from 'react';
import type { DailyInvestigacaoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  MAIN_STATEMENT_REVEAL_INTERVAL,
  STARTING_HEARTS,
  SUSPECT_CARD_ANIMATION_DELAY_STEP,
  SUSPECT_GRID_COLUMNS,
  SUSPECT_GRID_GAP,
  SUSPECT_GRID_MARGIN,
  SUSPECT_GRID_MAX_WIDTH,
  SUSPECT_GRID_MIN_WIDTH,
} from '../utils/constants';
import type { GameState } from '../utils/types';
import { useInvestigacaoEngine } from '../utils/useInvestigacaoEngine';
import { ReleaseModal } from './ReleaseModal';
import { ResultsSplash } from './ResultsSplash';
import { Statements } from './Statements';
import { SuspectCard } from './SuspectCard';

/**
 * Props accepted by the {@link InvestigacaoGame} component.
 */
export type InvestigacaoGameProps = {
  /**
   * Today's Investigação payload, as resolved by `GameScreen`.
   */
  data: DailyInvestigacaoEntry;
  /**
   * Restored or freshly initialized game state for today's case.
   */
  initialState: GameState;
};

/**
 * Renders a full day of Investigação: suspect grid, progressive clue list,
 * release confirmation flow, and a fullscreen results splash once the case
 * reaches a win or loss.
 *
 * @param props Today's Investigação payload and initialized game state.
 * @returns The rendered Investigação game.
 */
export function InvestigacaoGame({
  data,
  initialState,
}: InvestigacaoGameProps) {
  const {
    hearts,
    released,
    activeSuspectId,
    showResults,
    setShowResults,
    visibleStatements,
    visibleAdditionalStatements,
    isWin,
    isComplete,
    score,
    progress,
    onNeedClue,
    onSelectSuspect,
    onDeselectSuspect,
    onRelease,
  } = useInvestigacaoEngine(data, initialState);
  const [cardWidth, containerRef] = useCardWidthByContainerRef(
    SUSPECT_GRID_COLUMNS,
    {
      margin: SUSPECT_GRID_MARGIN,
      gap: SUSPECT_GRID_GAP,
      maxWidth: SUSPECT_GRID_MAX_WIDTH,
      minWidth: SUSPECT_GRID_MIN_WIDTH,
    },
  );

  const activeSuspect = useMemo(
    () =>
      data.suspects.find((suspect) => suspect.id === activeSuspectId) ?? null,
    [activeSuspectId, data.suspects],
  );
  const culprit =
    data.suspects.find((suspect) => suspect.id === data.culpritId) ?? null;
  const releaseGoal = data.suspects.length - 1;

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
          icon={UserRoundCheck}
          value={`${released.length}/${releaseGoal}`}
          label="Suspeitos liberados"
        />
        <GameStat
          icon={Heart}
          value={`${hearts}/${STARTING_HEARTS}`}
          label="Dicas extras restantes"
          align="center"
        />
        <GameStat
          icon={Coins}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <GameTitle
        title="Quem é o culpado?"
        description={
          <>
            Libere alguém que{' '}
            <span className="text-primary underline font-bold">não</span> se
            encaixe nas declarações.
          </>
        }
      />

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      <div className="flex w-full justify-center">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${SUSPECT_GRID_COLUMNS}, minmax(0, ${cardWidth}px))`,
          }}
        >
          {data.suspects.map((suspect, index) => {
            const releaseOrder = released.indexOf(suspect.id);
            const isReleased = releaseOrder >= 0;

            return (
              <SuspectCard
                key={suspect.id}
                suspect={suspect}
                cardWidth={cardWidth}
                isReleased={isReleased}
                releaseOrder={releaseOrder}
                isActive={activeSuspectId === suspect.id}
                isCulprit={isComplete && suspect.id === data.culpritId}
                disabled={isReleased || isComplete}
                animationDelay={index * SUSPECT_CARD_ANIMATION_DELAY_STEP}
                onSelect={() => onSelectSuspect(suspect.id)}
              />
            );
          })}
        </div>
      </div>

      <Surface className="flex w-full flex-col gap-3 bg-card px-5 py-5">
        <div className="flex flex-col gap-1">
          <Text
            strong
            className="text-center"
          >
            Declarações
          </Text>
          <Text
            type="secondary"
            className="text-center text-xs"
          >
            Uma nova pista é revelada a cada {MAIN_STATEMENT_REVEAL_INTERVAL}{' '}
            inocentes liberados.
          </Text>
        </div>

        <Statements
          statements={visibleStatements}
          additionalStatements={visibleAdditionalStatements}
          released={released}
        />

        {!isComplete && hearts > 0 && (
          <Popconfirm
            title="Revelar mais uma dica?"
            description="Isso vai consumir uma das suas dicas extras restantes."
            onConfirm={onNeedClue}
            okText="Revelar"
            cancelText="Cancelar"
          >
            <Button
              variant="outlined"
              size="small"
            >
              Preciso de mais dicas
            </Button>
          </Popconfirm>
        )}

        {!isComplete && hearts <= 0 && (
          <Text
            type="secondary"
            className="text-center text-sm"
          >
            Você já gastou todas as dicas extras de hoje.
          </Text>
        )}
      </Surface>

      <ReleaseModal
        suspect={activeSuspect}
        hearts={hearts}
        released={released}
        statements={visibleStatements}
        additionalStatements={visibleAdditionalStatements}
        onClose={onDeselectSuspect}
        onRelease={onRelease}
      />

      {isComplete && showResults && culprit && (
        <ResultsSplash
          win={isWin}
          culprit={culprit}
          reason={data.reason.pt}
          hearts={hearts}
          totalHearts={STARTING_HEARTS}
          releasedCount={released.length}
          totalSuspects={data.suspects.length}
          score={score}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
