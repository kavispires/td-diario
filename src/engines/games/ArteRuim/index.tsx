import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Keyboard } from '@components/games/Keyboard';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { Coins, Search } from 'lucide-react';
import { useState } from 'react';
import type { DailyArteRuimEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { DrawingCarousel } from './components/DrawingCarousel';
import { Prompt } from './components/Prompt';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import { ARTE_RUIM_HEARTS } from './utils/constants';
import { getInitialState, isDailyArteRuimEntry } from './utils/helpers';
import { useArteRuimEngine } from './utils/useArteRuimEngine';

/**
 * Props accepted by the {@link DailyArteRuimGame} component.
 */
type DailyArteRuimGameProps = {
  /**
   * Today's Arte Ruim payload, as resolved by `GameScreen`.
   */
  data: DailyArteRuimEntry | PlaceholderGameData;
};

/**
 * Renders a full day of Arte Ruim: the drawing clues, the masked prompt,
 * the letter keyboard, and a fullscreen results splash once the player
 * wins or runs out of hearts.
 *
 * @param props Today's Arte Ruim payload.
 * @returns The rendered Arte Ruim game.
 */
export function DailyArteRuimGame({ data }: DailyArteRuimGameProps) {
  if (!isDailyArteRuimEntry(data)) {
    return (
      <Surface className="mx-auto flex w-full max-w-md flex-col items-center gap-4 bg-card px-5 py-8 text-center">
        <Title level={4}>Não foi possível abrir o desafio de hoje</Title>
        <Text type="secondary">
          Os dados de Arte Ruim vieram incompletos. Tente voltar ao hub e abrir
          de novo.
        </Text>
      </Surface>
    );
  }

  return <ArteRuimGameContent data={data} />;
}

/**
 * Props accepted by the internal {@link ArteRuimGameContent} component.
 */
type ArteRuimGameContentProps = {
  /**
   * Validated Arte Ruim payload for today's challenge.
   */
  data: DailyArteRuimEntry;
};

/**
 * Hook-owning inner component for the validated Arte Ruim payload.
 *
 * @param props Today's validated Arte Ruim payload.
 * @returns The rendered Arte Ruim game.
 */
function ArteRuimGameContent({ data }: ArteRuimGameContentProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    hearts,
    guesses,
    solution,
    totalLetters,
    revealedLetters,
    wrongGuesses,
    score,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    guessLetter,
  } = useArteRuimEngine(data, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      <GameStatsRow>
        <GameStat
          icon={Search}
          value={`${revealedLetters}/${totalLetters}`}
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

      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>Adivinhe a expressão</Title>
        <Text type="secondary">
          Observe os desenhos e descubra a resposta, letra por letra.
        </Text>
      </div>

      <DrawingCarousel drawings={data.drawings} />

      <Prompt
        text={data.text}
        solution={solution}
      />

      <Text
        type="secondary"
        className="text-center text-sm"
      >
        Erros: {wrongGuesses}/{ARTE_RUIM_HEARTS}
      </Text>

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
          drawings={data.drawings}
          revealedLetters={revealedLetters}
          totalLetters={totalLetters}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
