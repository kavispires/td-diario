import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Keyboard } from '@components/games/Keyboard';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { Lightbulb, Repeat } from 'lucide-react';
import { useState } from 'react';
import type { DailyMapeamentoEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import {
  GuessedLocation,
  LocationFragments,
} from './components/GuessedLocation';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import {
  HEADER_HEARTS_SIZE,
  LOCATION_FRAGMENT_PLACEHOLDER,
  MAPEAMENTO_HEARTS,
} from './utils/constants';
import { getInitialState } from './utils/helpers';
import { useMapeamentoEngine } from './utils/useMapeamentoEngine';

/**
 * Props accepted by the {@link DailyMapeamentoGame} component.
 */
type DailyMapeamentoGameProps = {
  /**
   * Today's Mapeamento payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
};

function isDailyMapeamentoEntry(
  data: PlaceholderGameData,
): data is DailyMapeamentoEntry {
  return (
    typeof data.language === 'string' &&
    typeof data.setId === 'string' &&
    typeof data.location === 'string' &&
    Array.isArray(data.clues)
  );
}

/**
 * Renders a full day of Mapeamento: clue progression, fragment discovery,
 * free-text guesses, and a fullscreen result splash once the game ends.
 *
 * @param props Today's Mapeamento payload.
 * @returns The rendered Mapeamento game.
 */
export function DailyMapeamentoGame({ data }: DailyMapeamentoGameProps) {
  if (!isDailyMapeamentoEntry(data)) {
    throw new Error('Dados inválidos para o desafio de Mapeamento.');
  }

  const [initialState] = useState(() => getInitialState(data));
  const [typedLocation, setTypedLocation] = useState('');
  const {
    hearts,
    guesses,
    allClues,
    availableClues,
    locationFragments,
    keysState,
    showResults,
    setShowResults,
    score,
    progress,
    isWin,
    isComplete,
    hasFoundAllLetters,
    submitLocation,
  } = useMapeamentoEngine(data, initialState);

  function handleTypeLetter(letter: string) {
    if (isComplete) {
      return;
    }

    setTypedLocation((previous) => previous + letter);
  }

  function handleBackspace() {
    if (isComplete) {
      return;
    }

    setTypedLocation((previous) => previous.slice(0, -1));
  }

  function handleSubmit() {
    if (isComplete) {
      return;
    }

    const didAcceptGuess = submitLocation(typedLocation);
    if (didAcceptGuess) {
      setTypedLocation('');
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-8">
      <GameStatsRow
        progress={isComplete ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={Repeat}
          value={`${guesses.length}/${MAPEAMENTO_HEARTS}`}
          label="Tentativas usadas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={MAPEAMENTO_HEARTS}
            size={HEADER_HEARTS_SIZE}
          />
        </div>

        <GameStat
          icon={Lightbulb}
          value={`${availableClues.length}/${allClues.length}`}
          label="Pistas liberadas"
          align="end"
        />
      </GameStatsRow>

      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>{gameInfo.name.pt}</Title>
        <Text type="secondary">Que lugar é esse?</Text>
      </div>

      <Surface className="bg-card px-5 py-5">
        <ul className="grid gap-3">
          {allClues.map((clue, index) => {
            const isAvailable = availableClues.includes(clue);

            if (!isComplete && !isAvailable) {
              return null;
            }

            return (
              <li
                key={`${index}-${clue}`}
                className={`grid grid-cols-[2rem_1fr] items-start gap-3 rounded-2xl px-3 py-3 ${
                  isAvailable ? 'bg-primary-soft' : 'bg-border/70 opacity-70'
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-semibold text-foreground">
                  {index + 1}
                </span>
                <Text className="pt-1 leading-relaxed">{clue}</Text>
              </li>
            );
          })}
        </ul>
      </Surface>

      {!isWin && <LocationFragments fragments={locationFragments} />}

      {hasFoundAllLetters && !isComplete && (
        <div className="rounded-3xl bg-gold-soft px-4 py-3 text-center shadow-sm">
          <Text>
            Parece que você já encontrou todas as letras em tentativas
            diferentes. Agora só falta digitar o nome completo.
          </Text>
        </div>
      )}

      {isComplete && (
        <Surface
          className={`px-5 py-5 text-center ${isWin ? 'bg-gold-soft' : 'bg-card'}`}
        >
          <Text type="secondary">O lugar é:</Text>
          <div className="mt-2">
            <Title level={4}>{data.location}</Title>
          </div>
        </Surface>
      )}

      {!isComplete && (
        <Surface className="flex flex-col gap-3 bg-card px-5 py-5">
          <GuessedLocation
            typedLocation={typedLocation}
            fragments={locationFragments}
          />

          <Keyboard
            keysState={keysState}
            onKeyPress={handleTypeLetter}
            onEnterClick={handleSubmit}
            onBackspaceClick={handleBackspace}
            disabled={isComplete}
            color={gameInfo.color}
            withNumbers
            withSpaceBar
            withScoreDots={false}
            getAriaLabel={(key) => `Digitar ${key.toUpperCase()}`}
          />
        </Surface>
      )}

      {locationFragments.includes(LOCATION_FRAGMENT_PLACEHOLDER) &&
        !isComplete && (
          <Text
            type="secondary"
            className="text-center text-sm"
          >
            O fragmento mostra letras que já apareceram nas suas tentativas. Os
            espaços cinza ainda podem ser letras ou espaços reais.
          </Text>
        )}

      {guesses.length > 0 && (
        <Surface className="bg-card px-5 py-5">
          <Title
            level={5}
            className="mb-3"
          >
            Suas tentativas
          </Title>

          <div className="flex flex-wrap gap-2">
            {guesses.map((guess, index) => (
              <span
                key={`${guess}-${index}`}
                className="rounded-full bg-border px-3 py-1.5 text-sm font-medium text-foreground"
              >
                {guess.toUpperCase()}
              </span>
            ))}
          </div>
        </Surface>
      )}

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

      {showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          location={data.location}
          guesses={guesses}
          score={score}
          revealedClues={availableClues.length}
          totalClues={allClues.length}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
