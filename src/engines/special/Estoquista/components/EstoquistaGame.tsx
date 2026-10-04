import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Paragraph, Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { cn } from '@utils/cn';
import { ArchiveRestore, ClipboardCheck, Coins, Package2 } from 'lucide-react';
import type { DailyEstoquistaEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  ESTOQUISTA_BOARD_COLUMNS,
  ESTOQUISTA_CARD_WIDTH_CONFIG,
  ESTOQUISTA_CURRENT_GOOD_MAX_WIDTH,
  ESTOQUISTA_CURRENT_GOOD_WIDTH_RATIO,
  ESTOQUISTA_HEART_ICON_SIZE,
  ESTOQUISTA_HEART_PENALTY,
  ESTOQUISTA_PHASE,
} from '../utils/constants';
import type { GameState } from '../utils/types';
import { useEstoquistaEngine } from '../utils/useEstoquistaEngine';
import { FulfillmentBoard } from './FulfillmentBoard';
import { Orders } from './Orders';
import { ResultsSplash } from './ResultsSplash';
import { StockingBoard } from './StockingBoard';
import { WarehouseGoodCard } from './WarehouseGoodCard';

/**
 * Props accepted by the {@link EstoquistaGame} component.
 */
export type EstoquistaGameProps = {
  /**
   * Today's Estoquista payload, as resolved by `GameScreen`.
   */
  data: DailyEstoquistaEntry;
  /**
   * Persisted per-day state restored before the engine initializes.
   */
  initialState: GameState;
};

/**
 * Renders Estoquista's full interactive game flow from an already-restored
 * initial state.
 *
 * @param props Today's Estoquista payload and restored state.
 * @returns The rendered Estoquista game.
 */
export function EstoquistaGame({ data, initialState }: EstoquistaGameProps) {
  const {
    hearts,
    totalHearts,
    phase,
    warehouse,
    fulfillments,
    lastPlacedGoodId,
    activeOrder,
    evaluations,
    currentGood,
    showResults,
    setShowResults,
    progress,
    score,
    isWin,
    isComplete,
    onPlaceGood,
    onSelectOrder,
    onFulfill,
    onTakeBack,
    onSubmit,
    reset,
  } = useEstoquistaEngine(data, initialState);
  const [itemWidth, containerRef] = useCardWidthByContainerRef(
    ESTOQUISTA_BOARD_COLUMNS,
    ESTOQUISTA_CARD_WIDTH_CONFIG,
  );

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4"
    >
      <GameStatsRow
        progress={isWin ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Package2}
          value={`${warehouse.filter(Boolean).length}/${data.goods.length}`}
          label="Prateleiras organizadas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={totalHearts}
            size={ESTOQUISTA_HEART_ICON_SIZE}
          />
        </div>

        <GameStat
          icon={Coins}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <Text
        strong
        className="text-center"
      >
        {data.title}
      </Text>

      <Pill>
        {phase === ESTOQUISTA_PHASE.STOCKING
          ? 'Fase 1 · Arrumando o estoque'
          : 'Fase 2 · Separando os pedidos'}
      </Pill>

      {phase === ESTOQUISTA_PHASE.STOCKING ? (
        <>
          <Paragraph className="mb-0 text-center">
            Escolha uma lógica e memorize onde cada caixa ficou. Depois disso,
            você vai precisar achar tudo no escuro.
          </Paragraph>

          <StockingBoard
            warehouse={warehouse}
            onPlaceGood={onPlaceGood}
            width={itemWidth}
            lastPlacedGoodId={lastPlacedGoodId}
          />

          <Surface className="flex w-full flex-col items-center gap-3 bg-card px-5 py-6 text-center">
            <Text type="secondary">Produto atual</Text>
            {currentGood ? (
              <WarehouseGoodCard
                itemId={currentGood}
                width={Math.min(
                  itemWidth * ESTOQUISTA_CURRENT_GOOD_WIDTH_RATIO,
                  ESTOQUISTA_CURRENT_GOOD_MAX_WIDTH,
                )}
                highlighted
              />
            ) : (
              <Title level={4}>Prateleiras prontas!</Title>
            )}
          </Surface>
        </>
      ) : (
        <>
          <Paragraph className="mb-0 text-center">
            Ative um pedido, coloque-o na prateleira certa e mande para fora de
            estoque o item que não aparece no galpão.
          </Paragraph>

          <Orders
            orders={data.orders}
            fulfillments={fulfillments}
            activeOrder={activeOrder}
            onSelectOrder={onSelectOrder}
            shelfWidth={itemWidth}
          />

          <FulfillmentBoard
            warehouse={warehouse}
            fulfillments={fulfillments}
            activeOrder={activeOrder}
            onFulfill={onFulfill}
            onTakeBack={onTakeBack}
            width={itemWidth}
            reveal={isComplete}
          />

          <div className="flex w-full items-center gap-3">
            <Button
              variant="outlined"
              size="small"
              icon={<ArchiveRestore />}
              disabled={hearts <= ESTOQUISTA_HEART_PENALTY || isComplete}
              onClick={reset}
              className="flex-1"
            >
              {`Recomeçar (-${ESTOQUISTA_HEART_PENALTY} coração)`}
            </Button>

            <Button
              variant="primary"
              size="small"
              icon={<ClipboardCheck />}
              disabled={
                fulfillments.length !== data.orders.length || isComplete
              }
              onClick={onSubmit}
              className="flex-1"
            >
              Enviar pedidos
            </Button>
          </div>
        </>
      )}

      {evaluations.length > 0 && (
        <Surface className="flex w-full flex-col gap-2 bg-card px-4 py-4">
          <Text
            strong
            className="text-center"
          >
            Tentativas
          </Text>
          <div className="flex flex-wrap justify-center gap-2">
            {evaluations.map((attempt, index) => (
              <div
                key={`${attempt.join('-')}-${index}`}
                role="img"
                className="flex items-center gap-1 rounded-full bg-surface px-3 py-2"
                aria-label={`Tentativa ${index + 1}: ${attempt.filter(Boolean).length} de ${attempt.length} pedidos corretos`}
              >
                {attempt.map((isCorrect, itemIndex) => (
                  <span
                    key={`${index}-${itemIndex}`}
                    className={cn(
                      'h-3 w-3 rounded-full',
                      isCorrect ? 'bg-gold' : 'bg-destructive',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
            ))}
          </div>
        </Surface>
      )}

      {phase === ESTOQUISTA_PHASE.STOCKING && (
        <Button
          variant="outlined"
          size="small"
          icon={<ArchiveRestore />}
          disabled={hearts <= ESTOQUISTA_HEART_PENALTY || isComplete}
          onClick={reset}
        >
          {`Recomeçar (-${ESTOQUISTA_HEART_PENALTY} coração)`}
        </Button>
      )}

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          title={data.title}
          hearts={hearts}
          totalHearts={totalHearts}
          evaluations={evaluations}
          score={score}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
