import { DailyItem } from '@components/games/DailyItem';
import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { Keyboard } from '@components/games/Keyboard';
import { LetterPrompt } from '@components/games/LetterPrompt';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Surface } from '@components/ui/Surface';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { countSolvedLetters, countTotalLetters } from '@utils/prompts';
import { Coins, Type } from 'lucide-react';
import type { DailyFilmacoEntry } from 'types/games';
import { gameInfo } from '../info';
import { DOUBLE_FEATURE_CHARACTER, FILMACO_HEARTS } from '../utils/constants';
import type { GameState } from '../utils/types';
import { useFilmacoEngine } from '../utils/useFilmacoEngine';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link FilmacoGame} component.
 */
export type FilmacoGameProps = {
  /**
   * Today's Filmaco payload, validated by {@link isDailyFilmacoEntry}.
   */
  data: DailyFilmacoEntry;
  /**
   * Persisted starting state restored for the current daily challenge.
   */
  initialState: GameState;
};

/**
 * Renders the full interactive Filmaco board using a precomputed initial
 * engine state.
 *
 * @param props Today's Filmaco payload and restored starting state.
 * @returns The rendered Filmaco game.
 */
export function FilmacoGame({ data, initialState }: FilmacoGameProps) {
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

      <LetterPrompt
        text={data.title}
        solution={solution}
        allowNumbers
        separatorWord={DOUBLE_FEATURE_CHARACTER}
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
