import { DailyItem } from '@components/games/DailyItem';
import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { cn } from '@utils/cn';
import { Coins, Grid2x2, SendHorizontal, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import type { DailyQuartetosEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  QUARTETOS_CARD_WIDTH_SETTINGS,
  QUARTETOS_GRID_SHAKE_ANIMATION_DURATION_SECONDS,
  QUARTETOS_GRID_SHAKE_KEYFRAMES,
  QUARTETOS_GROUP_SIZE,
  QUARTETOS_HEART_ICON_SIZE,
  QUARTETOS_ITEM_LAYOUT_TRANSITION,
  QUARTETOS_LEVEL_COLOR_CLASSES,
  QUARTETOS_QUARTETS_PER_PUZZLE,
} from '../utils/constants';
import type { GameState } from '../utils/types';
import { useQuartetosEngine } from '../utils/useQuartetosEngine';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link QuartetosGame} component.
 */
export type QuartetosGameProps = {
  /**
   * Dynamic payload resolved by `GameScreen` for today's Quartetos route.
   */
  data: DailyQuartetosEntry;
  /**
   * Restored or freshly built engine state for today's Quartetos session.
   */
  initialState: GameState;
};

/**
 * Renders the full Quartetos game body from a prepared initial state.
 *
 * @param props Today's Quartetos payload and restored state.
 * @returns The rendered game UI.
 */
export function QuartetosGame({ data, initialState }: QuartetosGameProps) {
  const {
    hearts,
    guesses,
    matches,
    grid,
    selection,
    latestAttempt,
    score,
    progress,
    feedback,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    onSelectItem,
    onDeselectAll,
    onShuffle,
    onSubmit,
    clearFeedback,
  } = useQuartetosEngine(data, initialState);
  const [itemWidth, containerRef] = useCardWidthByContainerRef(
    QUARTETOS_GROUP_SIZE,
    QUARTETOS_CARD_WIDTH_SETTINGS,
  );

  const solvedCount = Math.round(progress * data.sets.length);

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
          icon={Grid2x2}
          value={`${solvedCount}/${data.sets.length}`}
          label="Quartetos encontrados"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={data.sets.length}
            size={QUARTETOS_HEART_ICON_SIZE}
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
        title="4x4"
        description={`
              Faça ${QUARTETOS_QUARTETS_PER_PUZZLE} grupos de ${QUARTETOS_GROUP_SIZE} itens
              e revele os temas escondidos.
              `}
      />

      <div className="flex w-full flex-col gap-3 items-center">
        {matches.map((quartetSet) => {
          const levelColors =
            QUARTETOS_LEVEL_COLOR_CLASSES[quartetSet.level] ??
            QUARTETOS_LEVEL_COLOR_CLASSES[0];

          return (
            <Surface
              key={quartetSet.id}
              className={cn('border transition-colors', levelColors.surface)}
            >
              <Text
                strong
                className="text-center block"
              >
                {quartetSet.title}
              </Text>
              <div
                className="grid gap-2 rounded-[2rem] bg-card p-3 pt-0 shadow-sm"
                style={{
                  gridTemplateColumns: `repeat(${QUARTETOS_GROUP_SIZE}, ${itemWidth}px)`,
                }}
              >
                {quartetSet.itemsIds.map((itemId) => (
                  <motion.div
                    key={itemId}
                    layout="position"
                    layoutId={itemId}
                    transition={QUARTETOS_ITEM_LAYOUT_TRANSITION}
                    className={cn(
                      'flex items-center justify-center rounded-2xl p-1',
                      isComplete ? 'bg-white/50' : levelColors.item,
                    )}
                  >
                    <DailyItem
                      itemId={itemId}
                      width={itemWidth}
                    />
                  </motion.div>
                ))}
              </div>
            </Surface>
          );
        })}

        {grid.length > 0 && (
          <motion.div
            key={latestAttempt}
            className="grid gap-2 rounded-[2rem] bg-card p-3 shadow-sm"
            style={{
              gridTemplateColumns: `repeat(${QUARTETOS_GROUP_SIZE}, ${itemWidth}px)`,
            }}
            initial={false}
            animate={{
              x: latestAttempt > 0 ? QUARTETOS_GRID_SHAKE_KEYFRAMES : 0,
            }}
            transition={{
              duration: QUARTETOS_GRID_SHAKE_ANIMATION_DURATION_SECONDS,
              ease: 'easeOut',
            }}
          >
            {grid.map((itemId, index) => {
              const isSelected = selection.includes(itemId);

              return (
                <motion.button
                  key={itemId}
                  layout="position"
                  layoutId={itemId}
                  transition={QUARTETOS_ITEM_LAYOUT_TRANSITION}
                  type="button"
                  onClick={() => onSelectItem(itemId)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? 'Desmarcar' : 'Selecionar'} item ${index + 1}`}
                  className={cn(
                    'flex items-center justify-center rounded-2xl border-2 bg-white/95 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-soft',
                    isSelected
                      ? 'border-secondary bg-secondary-soft shadow-sm'
                      : 'border-transparent hover:border-primary/30',
                  )}
                  style={{ width: itemWidth, height: itemWidth }}
                >
                  <DailyItem
                    itemId={itemId}
                    width={itemWidth}
                  />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {feedback && (
        <Alert
          type="info"
          message={feedback}
          closable
          onClose={clearFeedback}
          className="w-full"
        />
      )}

      {!isComplete && (
        <div className="flex w-full flex-wrap justify-center gap-2">
          <Button
            variant="outlined"
            size="small"
            icon={
              <Shuffle
                className="h-4 w-4"
                aria-hidden="true"
              />
            }
            disabled={grid.length === 0}
            onClick={onShuffle}
          >
            Embaralhar
          </Button>

          <Button
            variant="outlined"
            size="small"
            disabled={selection.length === 0}
            onClick={onDeselectAll}
          >
            Desmarcar
          </Button>

          <Button
            variant="primary"
            size="small"
            icon={
              <SendHorizontal
                className="h-4 w-4"
                aria-hidden="true"
              />
            }
            disabled={selection.length !== QUARTETOS_GROUP_SIZE}
            onClick={onSubmit}
          >
            Enviar
          </Button>
        </div>
      )}

      <Text
        type="secondary"
        className="text-center"
      >
        Você pode segurar o dedo no ícone para ter uma pista visual do item, mas
        o tema do quarteto nem sempre usa exatamente esse nome.
      </Text>

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          score={score}
          guessesCount={guesses.length}
          challengeNumber={data.number}
          sets={data.sets}
          guesses={guesses}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
