import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, SendHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DailyAlienadoEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { AlienDictionary } from './components/AlienDictionary';
import { Board } from './components/Board';
import { ResultsSplash } from './components/ResultsSplash';
import { getInitialState } from './utils/helpers';
import { useAlienadoEngine } from './utils/useAlienadoEngine';

/**
 * Props accepted by the {@link DailyAlienadoGame} component.
 */
type DailyAlienadoGameProps = {
  /**
   * Today's Alienado payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
};

function isDailyAlienadoEntry(
  data: PlaceholderGameData,
): data is DailyAlienadoEntry {
  return (
    Array.isArray((data as DailyAlienadoEntry).attributes) &&
    Array.isArray((data as DailyAlienadoEntry).requests) &&
    Array.isArray((data as DailyAlienadoEntry).itemsIds) &&
    typeof (data as DailyAlienadoEntry).solution === 'string'
  );
}

function AlienadoGameContent({ data }: { data: DailyAlienadoEntry }) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    hearts,
    guesses,
    selection,
    slotIndex,
    latestAttempt,
    isReady,
    isComplete,
    isWin,
    showResults,
    score,
    setShowResults,
    onSelectSlot,
    onSelectItem,
    onClearSlot,
    submitGuess,
  } = useAlienadoEngine(data, initialState);
  const previousGuesses = useMemo(
    () => guesses.map((guess) => guess.split('-')),
    [guesses],
  );
  const [itemWidth, containerRef] = useCardWidthByContainerRef(4, {
    margin: 36,
    gap: 10,
    maxWidth: 78,
    minWidth: 54,
  });

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col gap-4"
    >
      <GameStatsRow>
        <GameStat
          icon={SendHorizontal}
          value={`${guesses.length}/${data.requests.length}`}
          label="Tentativas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={data.requests.length}
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

      <Text
        type="secondary"
        className="text-center"
      >
        Decifre os símbolos do alienígena, monte as 4 entregas na ordem certa e
        envie tudo de uma vez.
      </Text>

      <AlienDictionary
        attributes={data.attributes}
        itemWidth={itemWidth}
      />

      <Board
        latestAttempt={latestAttempt}
        requests={data.requests}
        itemsIds={data.itemsIds}
        selection={selection}
        slotIndex={slotIndex}
        previousGuesses={previousGuesses}
        itemWidth={itemWidth}
        isReady={isReady}
        isComplete={isComplete}
        isWin={isWin}
        onSelectSlot={onSelectSlot}
        onSelectItem={onSelectItem}
        onClearSlot={onClearSlot}
        onSubmitGuess={submitGuess}
      />

      {isComplete && !showResults && (
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowResults(true)}
          >
            Ver resultado
          </Button>
        </div>
      )}

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          requests={data.requests}
          attributes={data.attributes}
          guesses={previousGuesses}
          solution={data.solution}
          score={score}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}

/**
 * Renders a full day of Alienado: the alien dictionary, the request board,
 * the available item pool, and a results splash once the round ends.
 *
 * @param props Today's Alienado payload.
 * @returns The rendered Alienado game.
 */
export function DailyAlienadoGame({ data }: DailyAlienadoGameProps) {
  if (!isDailyAlienadoEntry(data)) {
    return (
      <Surface className="mx-auto w-full max-w-md bg-surface/85 p-5 text-center">
        <Text>Os dados de Alienado não vieram no formato esperado.</Text>
      </Surface>
    );
  }

  return <AlienadoGameContent data={data} />;
}
