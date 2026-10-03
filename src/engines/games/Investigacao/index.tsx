import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Heart, Search, UserRoundCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DailyInvestigacaoEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { ReleaseModal } from './components/ReleaseModal';
import { ResultsSplash } from './components/ResultsSplash';
import { Statements } from './components/Statements';
import { SuspectCard } from './components/SuspectCard';
import { getInitialState, STARTING_HEARTS } from './utils/helpers';
import { useInvestigacaoEngine } from './utils/useInvestigacaoEngine';

/**
 * Props accepted by the {@link DailyInvestigacaoGame} component.
 */
type DailyInvestigacaoGameProps = {
  /**
   * Today's Investigação payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
};

/**
 * Checks whether the generic `GameScreen` payload has Investigação's
 * required shape before the engine starts rendering.
 *
 * @param data - Dynamic payload provided by `GameScreen`.
 * @returns Whether `data` matches {@link DailyInvestigacaoEntry}.
 */
function isDailyInvestigacaoEntry(
  data: PlaceholderGameData,
): data is DailyInvestigacaoEntry {
  return (
    (data.type === 'investigacao' || data.type === 'espionagem') &&
    typeof data.id === 'string' &&
    typeof data.number === 'number' &&
    typeof data.culpritId === 'string' &&
    Array.isArray(data.statements) &&
    Array.isArray(data.additionalStatements) &&
    Array.isArray(data.suspects) &&
    typeof data.reason === 'object' &&
    data.reason !== null &&
    'pt' in data.reason
  );
}

/**
 * Renders a full day of Investigação: suspect grid, progressive clue list,
 * release confirmation flow, and a fullscreen results splash once the case
 * reaches a win or loss.
 *
 * @param props Today's Investigação payload.
 * @returns The rendered Investigação game.
 */
export function DailyInvestigacaoGame({ data }: DailyInvestigacaoGameProps) {
  if (!isDailyInvestigacaoEntry(data)) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-[2rem] bg-card px-5 py-6 text-center shadow-sm">
        <Title level={4}>Não deu para abrir a investigação de hoje.</Title>
        <Text type="secondary">
          O pacote recebido está incompleto. Tente recarregar a página em
          instantes.
        </Text>
      </div>
    );
  }

  return <DailyInvestigacaoGameContent data={data} />;
}

/**
 * Props accepted by the internal typed Investigação renderer.
 */
type DailyInvestigacaoGameContentProps = {
  /**
   * Today's validated Investigação payload.
   */
  data: DailyInvestigacaoEntry;
};

/**
 * Renders the playable Investigação experience once today's payload has
 * been validated.
 *
 * @param props Today's validated Investigação payload.
 * @returns The rendered Investigação game.
 */
function DailyInvestigacaoGameContent({
  data,
}: DailyInvestigacaoGameContentProps) {
  const [initialState] = useState(() => getInitialState(data));
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
    onNeedClue,
    onSelectSuspect,
    onDeselectSuspect,
    onRelease,
  } = useInvestigacaoEngine(data, initialState);
  const [cardWidth, containerRef] = useCardWidthByContainerRef(4, {
    margin: 36,
    gap: 10,
    maxWidth: 112,
    minWidth: 64,
  });

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
      <GameStatsRow>
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
          icon={Search}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>Investigação</Title>
        <Text type="secondary">
          Cruze as pistas, descarte inocentes e deixe o culpado por último.
        </Text>
      </div>

      <div className="w-full rounded-[2rem] bg-card px-5 py-5 text-center shadow-sm">
        {!isComplete ? (
          <Text strong>
            Libere alguém que <span className="text-primary">não</span> se
            encaixe nas declarações.
          </Text>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Text strong>
              {isWin ? 'Você achou o culpado!' : 'Você liberou o culpado!'}
            </Text>
            <Text type="secondary">
              {isWin
                ? 'Abra o resultado para revisar o caso.'
                : 'Os crimes continuam acontecendo... pelo menos dá para revisar as pistas.'}
            </Text>
          </div>
        )}
      </div>

      <div
        className="grid w-full gap-3"
        style={{ gridTemplateColumns: `repeat(4, minmax(0, ${cardWidth}px))` }}
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
              animationDelay={index * 0.04}
              onSelect={() => onSelectSuspect(suspect.id)}
            />
          );
        })}
      </div>

      <div className="flex w-full flex-col gap-3 rounded-[2rem] bg-card px-5 py-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <Text strong>Declarações</Text>
          <Text type="secondary">
            Você revela uma pista principal a cada dois inocentes liberados.
          </Text>
        </div>

        <Statements
          statements={visibleStatements}
          additionalStatements={visibleAdditionalStatements}
          released={released}
        />

        {!isComplete && hearts > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={onNeedClue}
          >
            Preciso de mais dicas
          </Button>
        )}

        {!isComplete && hearts <= 0 && (
          <Text
            type="secondary"
            className="text-center text-sm"
          >
            Você já gastou todas as dicas extras de hoje.
          </Text>
        )}
      </div>

      {isComplete && !showResults && (
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowResults(true)}
        >
          Ver resultado
        </Button>
      )}

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
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
