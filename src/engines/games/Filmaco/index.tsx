import { DailyItem } from '@components/games/DailyItem';
import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Keyboard } from '@components/games/Keyboard';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Type } from 'lucide-react';
import { useState } from 'react';
import type { DailyFilmacoEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { Prompt } from './components/Prompt';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import {
  countSolvedLetters,
  countTotalLetters,
  FILMACO_HEARTS,
  getInitialState,
} from './utils/helpers';
import { useFilmacoEngine } from './utils/useFilmacoEngine';

/**
 * Props accepted by the internal typed Filmaco renderer.
 */
type FilmacoGameContentProps = {
  /**
   * Today's Filmaco payload, validated by {@link isDailyFilmacoEntry}.
   */
  data: DailyFilmacoEntry;
};

/**
 * Checks whether the generic `GameScreen` payload has Filmaco's required
 * shape before the engine starts rendering.
 *
 * @param data - Dynamic payload provided by `GameScreen`.
 * @returns Whether `data` matches {@link DailyFilmacoEntry}.
 */
function isDailyFilmacoEntry(
  data: PlaceholderGameData,
): data is DailyFilmacoEntry {
  return (
    data.type === 'filmaco' &&
    typeof data.id === 'string' &&
    typeof data.number === 'number' &&
    typeof data.title === 'string' &&
    Array.isArray(data.itemsIds) &&
    data.itemsIds.every((itemId) => typeof itemId === 'string') &&
    (typeof data.year === 'number' || typeof data.year === 'string') &&
    (data.isDoubleFeature === undefined ||
      typeof data.isDoubleFeature === 'boolean')
  );
}

/**
 * Renders the playable Filmaco experience once today's payload has been
 * validated.
 *
 * @param props Today's Filmaco payload.
 * @returns The rendered Filmaco game.
 */
function FilmacoGameContent({ data }: FilmacoGameContentProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    hearts,
    guesses,
    solution,
    showResults,
    setShowResults,
    score,
    isWin,
    isComplete,
    guessLetter,
  } = useFilmacoEngine(data, initialState);
  const [itemWidth, containerRef] = useCardWidthByContainerRef(7, {
    margin: 48,
    gap: 12,
    maxWidth: 88,
    minWidth: 48,
  });

  const solvedLetters = countSolvedLetters(solution);
  const totalLetters = countTotalLetters(solution);

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
    >
      <GameStatsRow>
        <GameStat
          icon={Type}
          value={`${solvedLetters}/${totalLetters}`}
          label="Letras descobertas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={FILMACO_HEARTS}
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

      <div className="flex w-full items-center justify-center">
        {data.isDoubleFeature
          ? `Sessão Dupla · ${data.year}`
          : `Lançamento · ${data.year}`}
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        Use as pistas visuais e o ano para descobrir o nome exato do filme.
      </Text>

      <Surface className="flex w-full flex-wrap justify-center gap-3 bg-card px-4 py-4">
        {data.itemsIds.map((itemId, index) => (
          <DailyItem
            key={`${itemId}-${index}`}
            itemId={itemId}
            width={itemWidth}
          />
        ))}
      </Surface>

      <Prompt
        text={data.title}
        solution={solution}
      />

      {isComplete && !showResults && (
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowResults(true)}
        >
          Ver resultado
        </Button>
      )}

      <Keyboard
        keysState={guesses}
        onKeyPress={guessLetter}
        disabled={isComplete}
        color={gameInfo.color}
        withNumbers
        getAriaLabel={(key, points) =>
          `Palpite ${key.toUpperCase()}, vale ${points} ponto${points > 1 ? 's' : ''}`
        }
      />

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          title={data.title}
          year={data.year}
          isDoubleFeature={data.isDoubleFeature}
          itemsIds={data.itemsIds}
          solvedLetters={solvedLetters}
          totalLetters={totalLetters}
          score={score}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}

/**
 * Entry point used by `GameScreen` for today's Filmaco route.
 *
 * @param props Dynamic payload for the `filmaco` game id.
 * @returns The playable Filmaco game after payload validation.
 * @throws When the fetched daily payload does not match Filmaco's expected
 *   shape.
 */
export function DailyFilmacoGame({ data }: { data: PlaceholderGameData }) {
  if (!isDailyFilmacoEntry(data)) {
    throw new Error('Invalid Filmaco daily payload.');
  }

  return <FilmacoGameContent data={data} />;
}
