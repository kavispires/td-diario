import { DailyItem } from '@components/games/DailyItem';
import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { Keyboard } from '@components/games/Keyboard';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Surface } from '@components/ui/Surface';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { countSolvedLetters, countTotalLetters } from '@utils/prompts';
import { Coins, Type } from 'lucide-react';
import { useState } from 'react';
import type { DailyFilmacoEntry } from 'types/games';
import { Prompt } from './components/Prompt';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import { FILMACO_HEARTS } from './utils/constants';
import { getInitialState } from './utils/helpers';
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
 * Renders the playable Filmaco experience once today's payload has been
 * validated.
 *
 * @param props Today's Filmaco payload.
 * @returns The rendered Filmaco game.
 */
export function DailyFilmacoGame({ data }: FilmacoGameContentProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    hearts,
    guesses,
    solution,
    showResults,
    setShowResults,
    score,
    progress,
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
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Type}
          value={`${solvedLetters}`}
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

      <GameTitle
        title={
          data.isDoubleFeature
            ? `Sessão Dupla · ${data.year}`
            : `Lançamento · ${data.year}`
        }
        description="Use as pistas visuais e o ano para descobrir o nome exato do filme."
      />

      <Surface className="flex w-full flex-wrap justify-center gap-3 bg-card p-2">
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

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

      <Keyboard
        keysState={guesses}
        onKeyPress={guessLetter}
        disabled={isComplete}
        color={gameInfo.color}
        withNumbers
        withScoreDots
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
