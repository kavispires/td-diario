import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { Popconfirm } from '@components/ui/Popconfirm';
import { Text } from '@components/ui/Typography';
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
import { notification } from '@utils/notification';
import { Coins, Lightbulb, Repeat } from 'lucide-react';
import { useEffect } from 'react';
import type { DailyPalavreadoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  PALAVREADO_SECRET_WORD_SCORE,
  PALAVREADO_WORD_SCORE,
  WORD_TONE_CLASSES,
} from '../utils/constants';
import { getTotalHearts } from '../utils/helpers';
import type { GameState } from '../utils/types';
import { usePalavreadoEngine } from '../utils/usePalavreadoEngine';
import { Board } from './Board';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link PalavreadoGame} component.
 */
export type PalavreadoGameProps = {
  /**
   * Today's Palavreado payload used to configure the engine and results.
   */
  data: DailyPalavreadoEntry;
  /**
   * Persisted state restored for the current daily challenge.
   */
  initialState: GameState;
};

/**
 * Renders a full day of Palavreado: a swap-based word board, smart-shuffle
 * hint, guesses history, and a fullscreen results splash once the puzzle
 * ends in a win or loss.
 *
 * @param props - Today's Palavreado payload and restored state.
 * @returns The rendered Palavreado game body.
 */
export function PalavreadoGame({ data, initialState }: PalavreadoGameProps) {
  const {
    hearts,
    selection,
    guesses,
    letters,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    selectLetter,
    swapLetters,
    submitGrid,
    swap,
    swaps,
    size,
    keyword,
    words,
    smartShuffle,
    usedSmartShuffle,
    score,
    latestCorrectLettersCount,
    scoringSummary,
    letterScore,
    progress,
  } = usePalavreadoEngine(data, initialState);
  const [itemWidth, containerRef] = useCardWidthByContainerRef(size, {
    margin: 32,
    gap: 12,
    maxWidth: 72,
    minWidth: 52,
  });

  // A short drag distance threshold lets regular taps fire instantly while
  // still recognizing an intentional drag gesture.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const fromIndex = active.data.current?.index;
    const toIndex = over?.data.current?.index;

    if (
      over &&
      typeof fromIndex === 'number' &&
      typeof toIndex === 'number' &&
      fromIndex !== toIndex
    ) {
      swapLetters(fromIndex, toIndex);
    }
  }

  const totalHearts = getTotalHearts(size);
  const isSmartShuffleDisabled =
    isComplete || usedSmartShuffle || hearts <= 1 || hearts === totalHearts;

  useEffect(() => {
    const { correctWords, extraWordsFound } = scoringSummary;

    if (
      latestCorrectLettersCount <= 0 &&
      correctWords.length === 0 &&
      extraWordsFound.length === 0
    ) {
      return;
    }

    notification.info(
      <div className="space-y-1">
        {latestCorrectLettersCount > 0 && (
          <p className="text-sm font-semibold text-foreground">
            + {letterScore} pontos por {latestCorrectLettersCount}{' '}
            {latestCorrectLettersCount === 1
              ? 'letra correta'
              : 'letras corretas'}
            !
          </p>
        )}
        {correctWords.length > 0 && (
          <p className="text-sm text-foreground">
            Palavras corretas: {correctWords.join(', ')} (+{' '}
            {correctWords.length * PALAVREADO_WORD_SCORE} pontos)
          </p>
        )}
        {extraWordsFound.length > 0 && (
          <p className="text-sm text-foreground">
            Palavras extras: {extraWordsFound.join(', ')} (+{' '}
            {extraWordsFound.length * PALAVREADO_SECRET_WORD_SCORE} pontos)
          </p>
        )}
      </div>,
      4500,
    );
  }, [letterScore, latestCorrectLettersCount, scoringSummary]);

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4"
    >
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Repeat}
          value={swaps}
          label="Trocas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={totalHearts}
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

      <GameTitle
        title={keyword}
        description="Troque as letras até reconstruir as palavras horizontais."
        classNames={{
          title: 'uppercase',
        }}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={handleDragEnd}
      >
        <Board
          letters={letters}
          onLetterSelection={selectLetter}
          selection={selection}
          swap={swap}
          guesses={guesses}
          size={size}
          itemWidth={itemWidth}
          disabled={isComplete}
        />
      </DndContext>

      {guesses.length > 0 && (
        <div className="flex w-full items-start gap-3 rounded-2xl bg-surface-raised/80 p-4">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-foreground bg-surface text-sm font-bold text-foreground/80"
            aria-hidden="true"
          >
            ?
          </div>
          <Text
            type="secondary"
            className="text-sm leading-relaxed"
          >
            Quando uma letra já foi testada naquela posição e segue errada, a
            casa ganha borda pontilhada. Evite enviar combinações com essas
            pistas repetidas.
          </Text>
        </div>
      )}

      {!isComplete && (
        <div className="flex w-full flex-col gap-3">
          <Button
            variant="primary"
            size="small"
            block
            onClick={submitGrid}
          >
            Enviar
          </Button>

          <div className="flex flex-col gap-2">
            <Popconfirm
              title="Você só pode usar esta dica uma vez."
              description="Isso embaralha apenas as letras erradas, priorizando vogais com vogais, consoantes com consoantes e evitando posições já testadas."
              onConfirm={smartShuffle}
              okText="Embaralhar"
              cancelText="Cancelar"
              disabled={isSmartShuffleDisabled}
            >
              <Button
                variant="outlined"
                size="small"
                block
                // disabled={isSmartShuffleDisabled}
                disabled
                icon={<Lightbulb aria-hidden="true" />}
              >
                Embaralhar inteligente
              </Button>
            </Popconfirm>

            {!usedSmartShuffle && (
              <Text
                type="secondary"
                className="text-center text-sm"
              >
                Disponível uma única vez, só depois da primeira tentativa e
                antes da última.
              </Text>
            )}
          </div>
        </div>
      )}

      <div className="flex w-full flex-col gap-2">
        {guesses.map((attempt, attemptIndex) => (
          <div
            key={`${attempt.join('-')}-${attemptIndex}`}
            className="flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-surface-raised/70 px-3 py-2"
          >
            {attempt.map((word, wordIndex) => {
              const isCorrectWord =
                word.toLowerCase() === words[wordIndex]?.toLowerCase();
              const wordTone =
                WORD_TONE_CLASSES[wordIndex] ??
                WORD_TONE_CLASSES[WORD_TONE_CLASSES.length - 1];

              return (
                <span
                  key={`${attemptIndex}-${wordIndex}-${word}`}
                  className={cn(
                    'rounded-md px-2 py-1 font-mono text-sm font-semibold uppercase tracking-wide',
                    isCorrectWord ? wordTone : 'bg-surface text-foreground',
                  )}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          words={words}
          guesses={guesses}
          swaps={swaps}
          score={score}
          usedSmartShuffle={usedSmartShuffle}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
