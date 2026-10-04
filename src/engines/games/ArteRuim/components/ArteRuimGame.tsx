import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { Keyboard } from '@components/games/Keyboard';
import { LetterPrompt } from '@components/games/LetterPrompt';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Coins, Search } from 'lucide-react';
import type { DailyArteRuimEntry } from 'types/games';
import { gameInfo } from '../info';
import { ARTE_RUIM_HEARTS } from '../utils/constants';
import type { GameState } from '../utils/types';
import { useArteRuimEngine } from '../utils/useArteRuimEngine';
import { DrawingCarousel } from './DrawingCarousel';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link ArteRuimGame} component.
 */
export type ArteRuimGameProps = {
  /**
   * Today's Arte Ruim payload, as resolved by `GameScreen`.
   */
  data: DailyArteRuimEntry;
  /**
   * Persisted initial state resolved for today's challenge before hooks run.
   */
  initialState: GameState;
};

/**
 * Renders the Arte Ruim game body using the validated payload and prepared
 * initial state from the outer entry component.
 *
 * @param props Today's challenge payload and prepared initial state.
 * @returns The rendered Arte Ruim game body.
 */
export function ArteRuimGame({ data, initialState }: ArteRuimGameProps) {
  const {
    hearts,
    guesses,
    solution,
    totalLetters,
    revealedLetters,
    score,
    progress,
    allowNumbers,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    guessLetter,
  } = useArteRuimEngine(data, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Search}
          value={`${revealedLetters}`}
          label="Letras descobertas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={ARTE_RUIM_HEARTS}
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
        title="Adivinhe a expressão"
        description="Observe os desenhos e descubra a resposta, letra por letra."
      />

      <DrawingCarousel drawings={data.drawings} />

      <LetterPrompt
        text={data.text}
        solution={solution}
        allowNumbers={allowNumbers}
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
        withNumbers={allowNumbers}
        withScoreDots
        getAriaLabel={(key, points) =>
          `Escolher a letra ${key.toUpperCase()}, vale ${points} ponto${points > 1 ? 's' : ''}`
        }
      />

      {isComplete && showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          score={score}
          answer={data.text}
          revealedLetters={revealedLetters}
          totalLetters={totalLetters}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
