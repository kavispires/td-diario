import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Popconfirm } from '@components/ui/Popconfirm';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { notification } from '@utils/notification';
import { Coins, Lightbulb, Repeat } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DailyPalavreadoEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { Board } from './components/Board';
import { ResultsSplash } from './components/ResultsSplash';
import {
  getInitialState,
  getTotalHearts,
  PALAVREADO_SECRET_WORD_SCORE,
  PALAVREADO_WORD_SCORE,
} from './utils/helpers';
import { usePalavreadoEngine } from './utils/usePalavreadoEngine';

/**
 * Props accepted by the {@link DailyPalavreadoGame} component.
 */
type DailyPalavreadoGameProps = {
  /**
   * Today's Palavreado payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
};

/**
 * Narrows a generic daily payload to the Palavreado shape expected by this
 * screen, throwing when the backend response is malformed.
 *
 * @param data - Generic daily payload from `GameScreen`.
 * @throws {Error} When the payload is missing Palavreado's required fields.
 */
function assertPalavreadoData(
  data: PlaceholderGameData,
): asserts data is DailyPalavreadoEntry {
  if (
    data.type !== 'palavreado' ||
    typeof data.keyword !== 'string' ||
    !Array.isArray(data.letters) ||
    !Array.isArray(data.words) ||
    !Array.isArray(data.scoringWords)
  ) {
    throw new Error('Daily Palavreado payload is invalid.');
  }
}

/**
 * Renders a full day of Palavreado: a swap-based word board, smart-shuffle
 * hint, guesses history, and a fullscreen results splash once the puzzle
 * ends in a win or loss.
 *
 * @param props - Today's Palavreado payload.
 * @returns The rendered Palavreado game.
 */
export function DailyPalavreadoGame({ data }: DailyPalavreadoGameProps) {
  assertPalavreadoData(data);

  const [initialState] = useState(() => getInitialState(data));
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
  } = usePalavreadoEngine(data, initialState);
  const [itemWidth, containerRef] = useCardWidthByContainerRef(size, {
    margin: 32,
    gap: 12,
    maxWidth: 72,
    minWidth: 52,
  });

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
      <GameStatsRow>
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

      <div className="flex flex-col items-center gap-1 text-center">
        <Text type="secondary">Palavra-chave</Text>
        <Title
          level={3}
          className="tracking-[0.35em] uppercase"
        >
          {keyword}
        </Title>
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        Troque as letras até reconstruir as palavras horizontais.
      </Text>

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
                disabled={isSmartShuffleDisabled}
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
                wordIndex === 0
                  ? 'bg-red-500 text-white'
                  : wordIndex === 1
                    ? 'bg-blue-500 text-white'
                    : wordIndex === 2
                      ? 'bg-purple-500 text-white'
                      : wordIndex === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-orange-500 text-white';

              return (
                <span
                  key={`${attemptIndex}-${wordIndex}-${word}`}
                  className={`rounded-md px-2 py-1 font-mono text-sm font-semibold uppercase tracking-wide ${
                    isCorrectWord ? wordTone : 'bg-surface text-foreground'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
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

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          words={words}
          swaps={swaps}
          score={score}
          usedSmartShuffle={usedSmartShuffle}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
