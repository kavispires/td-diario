import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { Popconfirm } from '@components/ui/Popconfirm';
import { Surface } from '@components/ui/Surface';
import { Paragraph, Text, Title } from '@components/ui/Typography';
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { cn } from '@utils/cn';
import {
  ArchiveRestore,
  ClipboardCheck,
  Coins,
  Heart,
  Package2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { DailyEstoquistaEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  ESTOQUISTA_BOARD_COLUMNS,
  ESTOQUISTA_CARD_WIDTH_CONFIG,
  ESTOQUISTA_CURRENT_GOOD_MAX_WIDTH,
  ESTOQUISTA_CURRENT_GOOD_WIDTH_RATIO,
  ESTOQUISTA_GOOD_LAYOUT_TRANSITION,
  ESTOQUISTA_HEART_ICON_SIZE,
  ESTOQUISTA_HEART_PENALTY,
  ESTOQUISTA_PHASE,
} from '../utils/constants';
import { getRequiredFulfillmentCount } from '../utils/helpers';
import type { GameState } from '../utils/types';
import { useEstoquistaEngine } from '../utils/useEstoquistaEngine';
import { FulfillmentBoard } from './FulfillmentBoard';
import { Orders } from './Orders';
import { ResultsSplash } from './ResultsSplash';
import { getGoodLayoutId, StockingBoard } from './StockingBoard';
import { WarehouseGoodItem } from './WarehouseGoodItem';

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
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  /**
   * Resolves a drag-and-drop gesture into an `onFulfill` call once an order
   * card is released over a shelf droppable.
   *
   * @param event - The dnd-kit drag end event.
   */
  function handleDragEnd(event: DragEndEvent) {
    const order = event.active.data.current?.order as string | undefined;
    const shelfIndex = event.over?.data.current?.shelfIndex as
      | number
      | undefined;

    if (order !== undefined && shelfIndex !== undefined) {
      onFulfill(shelfIndex, order);
    }
  }

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

      <GameTitle
        title={data.title}
        description={
          phase === ESTOQUISTA_PHASE.STOCKING
            ? 'Fase 1 · Arrumando o estoque'
            : 'Fase 2 · Separando os pedidos'
        }
      />

      {phase === ESTOQUISTA_PHASE.STOCKING ? (
        <>
          <StockingBoard
            warehouse={warehouse}
            onPlaceGood={onPlaceGood}
            width={itemWidth}
            lastPlacedGoodId={lastPlacedGoodId}
          />

          <Surface className="flex w-full flex-col items-center gap-3 bg-card px-5 py-6 text-center">
            {currentGood && (
              <Text
                strong
                className="text-sm"
              >
                Clique em uma prateleira vazia para posicionar o produto:
              </Text>
            )}
            <AnimatePresence
              mode="popLayout"
              initial={false}
            >
              {currentGood ? (
                <motion.div
                  key={currentGood}
                  layoutId={getGoodLayoutId(currentGood)}
                  transition={ESTOQUISTA_GOOD_LAYOUT_TRANSITION}
                  exit={{ opacity: 0 }}
                >
                  <WarehouseGoodItem
                    goodId={currentGood}
                    width={Math.min(
                      itemWidth * ESTOQUISTA_CURRENT_GOOD_WIDTH_RATIO,
                      ESTOQUISTA_CURRENT_GOOD_MAX_WIDTH,
                    )}
                    highlighted
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="ready"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Title level={4}>Prateleiras prontas!</Title>
                </motion.div>
              )}
            </AnimatePresence>
          </Surface>

          <Paragraph className="m-0 text-center text-sm">
            Um bom funcionário sempre sabe onde está cada produto. Lembre-se de
            usar uma certa lógica para memorizar a posição de cada produto.
          </Paragraph>
        </>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragEnd={handleDragEnd}
        >
          <FulfillmentBoard
            warehouse={warehouse}
            fulfillments={fulfillments}
            activeOrder={activeOrder}
            onFulfill={onFulfill}
            onTakeBack={onTakeBack}
            width={itemWidth}
            reveal={isComplete}
          />

          <div className="flex w-full justify-center">
            <Text
              strong
              className="text-sm text-center mb-0"
            >
              Recebemos 5 pedidos e apenas 4 deles estão em estoque!
            </Text>
          </div>

          <Orders
            orders={data.orders}
            fulfillments={fulfillments}
            activeOrder={activeOrder}
            onSelectOrder={onSelectOrder}
            shelfWidth={itemWidth}
            requiredCount={getRequiredFulfillmentCount(data)}
          />

          {!isComplete && (
            <Button
              variant="primary"
              size="small"
              icon={<ClipboardCheck />}
              disabled={
                fulfillments.length !== getRequiredFulfillmentCount(data)
              }
              onClick={onSubmit}
              className="flex-1"
            >
              Enviar pedidos
            </Button>
          )}
        </DndContext>
      )}

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {evaluations.length > 0 && (
        <Surface className="flex w-full flex-col gap-2 bg-card px-4 py-4">
          <Text
            strong
            className="text-center"
          >
            Tentativas
          </Text>
          <div className="flex flex-wrap justify-center gap-2">
            {evaluations.map((attempt, index) => {
              const sortedAttempt = attempt
                .map((isCorrect, itemIndex) => ({ isCorrect, itemIndex }))
                .sort((a, b) => Number(b.isCorrect) - Number(a.isCorrect));

              return (
                <div
                  key={`${attempt.join('-')}-${index}`}
                  role="img"
                  className="flex items-center gap-1 rounded-full bg-surface px-3 py-2"
                  aria-label={`Tentativa ${index + 1}: ${attempt.filter(Boolean).length} de ${attempt.length} pedidos corretos`}
                >
                  {sortedAttempt.map(({ isCorrect, itemIndex }) => (
                    <span
                      key={`${index}-${itemIndex}`}
                      className={cn(
                        'h-3 w-3 rounded-full',
                        isCorrect ? 'bg-success' : 'bg-destructive',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </Surface>
      )}

      {!isComplete && hearts > ESTOQUISTA_HEART_PENALTY && (
        <Popconfirm
          title="Recomeçar a arrumação do estoque?"
          description="Você vai perder um coração e precisará organizar tudo de novo."
          onConfirm={reset}
          okText="Recomeçar"
          cancelText="Cancelar"
          disabled={hearts <= ESTOQUISTA_HEART_PENALTY || isComplete}
        >
          <Button
            variant="outlined"
            size="small"
            icon={<ArchiveRestore />}
          >
            Recomeçar{' '}
            <span className="text-nowrap">
              (-{ESTOQUISTA_HEART_PENALTY}{' '}
              <Heart
                className="inline h-4 w-4 fill-destructive text-destructive"
                aria-hidden="true"
              />
              )
            </span>
          </Button>
        </Popconfirm>
      )}

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          orders={data.orders}
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
