import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import {
  Coins,
  GitCompareArrows,
  Link2,
  LoaderCircle,
  RefreshCcw,
  Save,
} from 'lucide-react';
import { useState } from 'react';
import type { DailyConexoesEntry } from 'types/games';
import { ResultsSplash } from './components/ResultsSplash';
import { SwipeablePair } from './components/SwipeablePair';
import { gameInfo } from './info';
import {
  MIN_REQUIRED_PAIRS,
  PAIR_CARD_COUNT,
  PAIR_CARD_GAP,
  PAIR_CARD_MARGIN,
  PAIR_CARD_MAX_WIDTH,
  PAIR_CARD_MIN_WIDTH,
} from './utils/constants';
import { getInitialState } from './utils/helpers';
import { useConexoesEngine } from './utils/useConexoesEngine';

/**
 * Props accepted by the {@link DailyConexoesGame} component.
 */
type DailyConexoesGameProps = {
  /**
   * Today's Conexões payload, as resolved by `GameScreen`.
   */
  data: DailyConexoesEntry;
};

/**
 * Renders a full day of Conexões: intro, pair evaluations, contribution
 * saving states, and a fullscreen results splash once the run is complete.
 *
 * @param props Today's Conexões payload.
 * @returns The rendered Conexões game.
 */
export function DailyConexoesGame({ data }: DailyConexoesGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const [cardWidth, pairContainerRef] = useCardWidthByContainerRef(
    PAIR_CARD_COUNT,
    {
      gap: PAIR_CARD_GAP,
      margin: PAIR_CARD_MARGIN,
      maxWidth: PAIR_CARD_MAX_WIDTH,
      minWidth: PAIR_CARD_MIN_WIDTH,
    },
  );
  const {
    currentPair,
    relatedPairs,
    evaluatedCount,
    showResults,
    setShowResults,
    progress,
    score,
    isIdle,
    isPlaying,
    isSaving,
    isRetryable,
    isWin,
    isLose,
    isComplete,
    canSave,
    canComplete,
    startGame,
    evaluatePair,
    savePairs,
    retrySave,
    finishWithoutSaving,
  } = useConexoesEngine(data, initialState);
  const currentPairNumber = evaluatedCount + 1;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={GitCompareArrows}
          value={`${evaluatedCount}/${MIN_REQUIRED_PAIRS}`}
          label="Pares avaliados"
        />
        <GameStat
          icon={Link2}
          value={relatedPairs.length}
          label="Relações marcadas"
          align="center"
        />
        <GameStat
          icon={Coins}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>{gameInfo.name.pt}</Title>
        <Text type="secondary">
          Compare pares de imagens e ajude o TD a descobrir novas relações.
        </Text>
      </div>

      {isSaving && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-8 text-center">
          <LoaderCircle
            className="h-8 w-8 animate-spin text-primary"
            aria-hidden="true"
          />
          <Title level={4}>Salvando suas conexões</Title>
          <Text type="secondary">
            Estamos enviando os pares que você marcou para o banco do TD.
          </Text>
        </Surface>
      )}

      {isIdle && !isComplete && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-6 text-center">
          <Text>
            Você vai receber pares de imagens para julgar. Vale cor parecida,
            tema em comum, objeto repetido ou qualquer associação que faça
            sentido para você.
          </Text>

          <div className="grid w-full gap-3 rounded-3xl bg-primary-soft px-4 py-4 text-left">
            <Text>1. Olhe as duas imagens.</Text>
            <Text>2. Marque Sim se elas combinam, Não se não combinam.</Text>
            <Text>3. Avalie pelo menos {MIN_REQUIRED_PAIRS} pares.</Text>
            <Text>4. Salve quando achar relações úteis.</Text>
          </div>

          <Button
            variant="primary"
            size="small"
            onClick={startGame}
          >
            Começar
          </Button>
        </Surface>
      )}

      {isPlaying && (
        <>
          <div className="flex w-full items-center justify-between gap-3">
            <Text
              strong
              className="text-sm"
            >
              Par {currentPairNumber}
            </Text>
            <Text
              type="secondary"
              className="text-sm"
            >
              Mínimo para encerrar: {MIN_REQUIRED_PAIRS}
            </Text>
          </div>

          <Surface className="flex w-full flex-col gap-3 bg-gold-soft px-5 py-6 text-center">
            <Title level={4}>Essas duas imagens estão relacionadas?</Title>
            <Text
              type="secondary"
              className="text-sm"
            >
              Use seu próprio julgamento — a conexão pode ser óbvia ou bem
              pessoal.
            </Text>
          </Surface>

          <div
            ref={pairContainerRef}
            className="w-full"
          >
            {currentPair ? (
              <SwipeablePair
                pair={currentPair}
                cardWidth={cardWidth}
                onEvaluate={evaluatePair}
                disabled={isSaving}
              />
            ) : (
              <Alert
                type="info"
                message="Acabaram os pares inéditos de hoje."
                description="Você pode salvar o que encontrou ou encerrar a sessão."
                showIcon
                className="w-full"
              />
            )}
          </div>

          {currentPair && (
            <div className="grid w-full grid-cols-2 gap-3">
              <Button
                variant="outlined"
                size="small"
                block
                onClick={() => evaluatePair(false)}
                disabled={isSaving}
              >
                Não
              </Button>
              <Button
                variant="primary"
                size="small"
                block
                onClick={() => evaluatePair(true)}
                disabled={isSaving}
              >
                Sim
              </Button>
            </div>
          )}

          {isRetryable && (
            <Alert
              type="error"
              message="Não conseguimos salvar suas conexões agora."
              description="Você pode tentar novamente sem perder os pares já marcados."
              showIcon
              className="w-full"
            />
          )}

          {!isRetryable && evaluatedCount < MIN_REQUIRED_PAIRS && (
            <Alert
              type="info"
              message={`Avalie pelo menos ${MIN_REQUIRED_PAIRS} pares para liberar o envio.`}
              description="Depois disso, você pode salvar suas conexões ou continuar explorando mais pares."
              showIcon
              className="w-full"
            />
          )}

          {!isRetryable && canSave && (
            <Alert
              type="success"
              message="Você já pode salvar."
              description="Se quiser, continue avaliando mais pares antes de encerrar."
              showIcon
              className="w-full"
            />
          )}

          {!isRetryable && canComplete && (
            <Alert
              type="warning"
              message="Você já pode encerrar por hoje."
              description="Como nenhuma relação foi marcada até agora, a sessão termina sem salvar contribuições."
              showIcon
              className="w-full"
            />
          )}

          <div className="flex w-full flex-col gap-3">
            {(canSave || isRetryable) && (
              <Button
                variant="primary"
                size="small"
                block
                icon={
                  isRetryable ? (
                    <RefreshCcw aria-hidden="true" />
                  ) : (
                    <Save aria-hidden="true" />
                  )
                }
                onClick={isRetryable ? retrySave : savePairs}
                disabled={!canSave && !isRetryable}
              >
                {isRetryable ? 'Tentar novamente' : 'Salvar e terminar'}
              </Button>
            )}

            {canComplete && (
              <Button
                variant="outlined"
                size="small"
                block
                onClick={finishWithoutSaving}
              >
                Cansei / terminar
              </Button>
            )}
          </div>
        </>
      )}

      {isWin && !showResults && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-gold-soft px-5 py-6 text-center">
          <Title level={4}>Você já conectou imagens hoje!</Title>
          <Text type="secondary">
            Sua contribuição foi salva. Abra o resumo para rever os pares que
            você marcou.
          </Text>
          <SeeResultsButton
            isComplete={isComplete}
            setShowResults={setShowResults}
          />
        </Surface>
      )}

      {isLose && !showResults && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-6 text-center">
          <Title level={4}>Sessão concluída</Title>
          <Text type="secondary">
            Hoje você preferiu não salvar nenhuma relação. Ainda assim, já valeu
            a avaliação dos pares.
          </Text>
          <SeeResultsButton
            isComplete={isComplete}
            setShowResults={setShowResults}
          />
        </Surface>
      )}

      {showResults && isComplete && (
        <ResultsSplash
          win={isWin}
          evaluatedCount={evaluatedCount}
          relatedPairs={relatedPairs}
          score={score}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
