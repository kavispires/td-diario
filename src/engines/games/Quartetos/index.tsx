import { DailyItem } from '@components/games/DailyItem';
import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { cn } from '@utils/cn';
import { Coins, SendHorizontal, Shuffle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { DailyQuartetosEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import {
  QUARTETOS_CARD_WIDTH_SETTINGS,
  QUARTETOS_GRID_SHAKE_ANIMATION_DURATION_SECONDS,
  QUARTETOS_GRID_SHAKE_KEYFRAMES,
  QUARTETOS_GROUP_SIZE,
  QUARTETOS_HEART_ICON_SIZE,
  QUARTETOS_PROGRESS_BAR_ANIMATION_DURATION_SECONDS,
  QUARTETOS_QUARTETS_PER_PUZZLE,
} from './utils/constants';
import { getInitialState, isDailyQuartetosEntry } from './utils/helpers';
import { useQuartetosEngine } from './utils/useQuartetosEngine';

/**
 * Props accepted by the {@link DailyQuartetosGame} component.
 */
type DailyQuartetosGameProps = {
  /**
   * Dynamic payload resolved by `GameScreen` for today's Quartetos route.
   */
  data: PlaceholderGameData;
};

/**
 * Returns the Tailwind classes used to style a revealed quartet card.
 *
 * @param isComplete - Whether the whole puzzle is already finished.
 * @returns The classes applied to the card container.
 */
function getMatchedCardClasses(isComplete: boolean): string {
  return cn(
    'border px-4 py-4 transition-colors',
    isComplete ? 'border-gold/50 bg-gold-soft' : 'border-secondary/20 bg-card',
  );
}

/**
 * Renders a full day of Quartetos: hidden quartets already found, the
 * remaining 4x4 grid, selection controls, and a fullscreen results splash
 * once the puzzle ends in a win or loss.
 *
 * @param props Today's Quartetos payload, as resolved by `GameScreen`.
 * @returns The rendered Quartetos game.
 */
export function DailyQuartetosGame({ data }: DailyQuartetosGameProps) {
  const quartetosData = useMemo(
    () => (isDailyQuartetosEntry(data) ? data : null),
    [data],
  );

  if (!quartetosData) {
    return (
      <Alert
        type="error"
        message="Os dados de Quartetos vieram em um formato inesperado."
        description="Tente voltar ao Hub e abrir o desafio novamente."
      />
    );
  }

  return <DailyQuartetosGameContent data={quartetosData} />;
}

/**
 * Props accepted by the internal {@link DailyQuartetosGameContent}
 * component, once the payload has been narrowed to the real Quartetos type.
 */
type DailyQuartetosGameContentProps = {
  /**
   * Today's Quartetos payload.
   */
  data: DailyQuartetosEntry;
};

/**
 * Renders Quartetos with fully narrowed data.
 *
 * @param props Today's Quartetos payload.
 * @returns The rendered game UI.
 */
function DailyQuartetosGameContent({ data }: DailyQuartetosGameContentProps) {
  const [initialState] = useState(() => getInitialState(data));
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
      <GameStatsRow>
        <GameStat
          icon={Sparkles}
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

      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>{gameInfo.name.pt}</Title>
        <Text type="secondary">
          Faça {QUARTETOS_QUARTETS_PER_PUZZLE} grupos de {QUARTETOS_GROUP_SIZE}{' '}
          e revele os temas escondidos.
        </Text>
      </div>

      {!isComplete && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{ width: `${progress * 100}%` }}
            transition={{
              duration: QUARTETOS_PROGRESS_BAR_ANIMATION_DURATION_SECONDS,
              ease: 'easeOut',
            }}
          />
        </div>
      )}

      <Pill className="bg-secondary text-white">
        {selection.length === 0
          ? `Selecione ${QUARTETOS_GROUP_SIZE} itens`
          : `${selection.length} de ${QUARTETOS_GROUP_SIZE} itens selecionados`}
      </Pill>

      <Text
        type="secondary"
        className="text-center"
      >
        Você pode segurar o dedo no ícone para ter uma pista visual do item, mas
        o tema do quarteto nem sempre usa exatamente esse nome.
      </Text>

      <div className="flex w-full flex-col gap-3">
        {matches.map((quartetSet) => (
          <Surface
            key={quartetSet.id}
            className={getMatchedCardClasses(isComplete)}
          >
            <Title
              level={5}
              className="text-center"
            >
              {quartetSet.title}
            </Title>

            <div
              className="mt-3 grid justify-items-center gap-2"
              style={{
                gridTemplateColumns: `repeat(${QUARTETOS_GROUP_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {quartetSet.itemsIds.map((itemId) => (
                <div
                  key={itemId}
                  className="flex items-center justify-center rounded-2xl bg-white/50 p-1"
                >
                  <DailyItem
                    itemId={itemId}
                    width={itemWidth}
                  />
                </div>
              ))}
            </div>
          </Surface>
        ))}

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
                <button
                  key={itemId}
                  type="button"
                  onClick={() => onSelectItem(itemId)}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? 'Desmarcar' : 'Selecionar'} item ${index + 1}`}
                  className={cn(
                    'flex items-center justify-center rounded-2xl border-2 bg-white/95 transition-all focus:outline-none focus:ring-2 focus:ring-primary-soft',
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
                </button>
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

      {isComplete && !showResults && (
        <Surface
          className={cn(
            'flex w-full flex-col items-center gap-4 px-5 py-6 text-center',
            isWin ? 'bg-gold-soft' : 'bg-card',
          )}
        >
          <Title level={4}>
            {isWin
              ? 'Você concluiu o Quartetos de hoje!'
              : 'Seu jogo já acabou'}
          </Title>
          <Text type="secondary">
            {isWin
              ? 'Abra o resumo para rever os quartetos e sua pontuação.'
              : 'Abra o resumo para conferir todos os quartetos revelados.'}
          </Text>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowResults(true)}
          >
            Ver resultado
          </Button>
        </Surface>
      )}

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
