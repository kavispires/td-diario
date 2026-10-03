import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Repeat, Send } from 'lucide-react';
import { useState } from 'react';
import type { DailyPortaisEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { Corridor } from './components/Corridor';
import { Passcode } from './components/Passcode';
import { ResultsSplash } from './components/ResultsSplash';
import { DEFAULT_HEARTS, EMPTY_PORTAIS_ENTRY } from './utils/constants';
import { getInitialState, getTotalMoves } from './utils/helpers';
import { usePortaisEngine } from './utils/usePortaisEngine';

/**
 * Props accepted by the {@link DailyPortaisGame} component.
 */
type DailyPortaisGameProps = {
  /**
   * Today's Portais payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
};

function isDailyPortaisEntry(
  data: PlaceholderGameData,
): data is DailyPortaisEntry {
  return (
    data.type === 'portais' &&
    typeof data.goal === 'number' &&
    Array.isArray(data.corridors)
  );
}

/**
 * Renders a full day of Portais: the corridor previews, rotating passcode
 * columns, guess history, and a results splash once the run ends in a win
 * or loss.
 *
 * @param props Today's Portais payload.
 * @returns The rendered Portais game.
 */
export function DailyPortaisGame({ data }: DailyPortaisGameProps) {
  const resolvedData = isDailyPortaisEntry(data) ? data : EMPTY_PORTAIS_ENTRY;
  const [initialState] = useState(() => getInitialState(resolvedData));
  const {
    hearts,
    guesses,
    moves,
    score,
    currentCorridorIndex,
    currentCorridor,
    currentCorridorIndexes,
    currentGuess,
    latestGuess,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    onSlideWordPosition,
    onSubmitPasscode,
  } = usePortaisEngine(resolvedData, initialState);
  const [imageWidth, containerRef] = useCardWidthByContainerRef(
    Math.min(Math.max(currentCorridor?.imagesIds.length ?? 3, 1), 3),
    {
      margin: 24,
      gap: 16,
      maxWidth: 210,
      minWidth: 88,
    },
  );

  if (!isDailyPortaisEntry(data)) {
    return (
      <Surface className="mx-auto flex w-full max-w-md justify-center bg-card px-5 py-6 text-center">
        <Text type="danger">Não conseguimos carregar o desafio de hoje.</Text>
      </Surface>
    );
  }

  const totalMoves = getTotalMoves(moves);
  const completedCorridors = isWin
    ? data.corridors.length
    : currentCorridorIndex;
  const latestGuesses = guesses[currentCorridorIndex] ?? [];
  const corridorLabel = isComplete
    ? 'Corredores revelados'
    : `Corredor ${currentCorridorIndex + 1} de ${data.corridors.length}`;

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
    >
      <GameStatsRow>
        <GameStat
          icon={Repeat}
          value={totalMoves}
          label="Movimentos"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={DEFAULT_HEARTS}
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

      <div className="flex flex-col items-center gap-2 text-center">
        <Pill>Desafio #{data.number}</Pill>
        <Text strong>Descubra a palavra que liga cada portal.</Text>
        <Text
          type="secondary"
          className="text-center"
        >
          Trave as letras certas e atravesse todos os corredores antes que os
          corações acabem.
        </Text>
      </div>

      <Pill className="bg-white/80 text-chrome shadow-none">
        {corridorLabel}
      </Pill>

      {currentCorridor && !isComplete && (
        <Surface className="flex w-full flex-col gap-4 bg-card px-5 py-6">
          <Corridor
            number={currentCorridorIndex + 1}
            totalCorridors={data.corridors.length}
            imagesIds={currentCorridor.imagesIds}
            width={imageWidth}
            moves={moves[currentCorridorIndex] ?? 0}
          />

          <Text
            type="secondary"
            className="text-center"
          >
            Organize as palavras verticalmente para formar a palavra-chave.
          </Text>

          <Text className="text-center text-lg font-semibold uppercase tracking-[0.32em]">
            {currentGuess}
          </Text>

          <Passcode
            passcode={currentCorridor.passcode}
            latestGuess={latestGuess}
            words={currentCorridor.words}
            currentCorridorIndexes={currentCorridorIndexes}
            onSlideWordPosition={onSlideWordPosition}
            disabled={isComplete}
          />

          <Button
            variant="primary"
            size="small"
            icon={<Send aria-hidden="true" />}
            onClick={onSubmitPasscode}
            disabled={currentGuess.length === 0 || currentGuess === latestGuess}
          >
            Enviar palavra-chave
          </Button>

          {latestGuesses.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {latestGuesses.map((guess, index) => (
                <span
                  key={`${guess}-${index}`}
                  className="rounded-full bg-surface-raised px-3 py-1 font-mono text-sm uppercase text-subtle-foreground"
                >
                  {guess}
                </span>
              ))}
            </div>
          )}
        </Surface>
      )}

      {isComplete && (
        <div className="grid w-full gap-4">
          {data.corridors.map((corridor, index) => (
            <Surface
              key={corridor.passcode}
              className="bg-card px-5 py-5"
            >
              <Corridor
                number={index + 1}
                totalCorridors={data.corridors.length}
                imagesIds={corridor.imagesIds}
                width={Math.max(imageWidth * 0.78, 72)}
                passcode={corridor.passcode}
                moves={moves[index] ?? 0}
                solved={index < completedCorridors}
              />
            </Surface>
          ))}
        </div>
      )}

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
          challengeNumber={data.number}
          corridors={data.corridors}
          currentCorridorIndex={currentCorridorIndex}
          moves={moves}
          guesses={guesses}
          goal={data.goal}
          score={score}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
