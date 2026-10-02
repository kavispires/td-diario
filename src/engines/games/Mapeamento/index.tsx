import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { TextInput } from '@components/ui/TextInput';
import { Text, Title } from '@components/ui/Typography';
import { Lightbulb, Repeat } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { DailyMapeamentoEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import {
  GuessedLocation,
  LocationFragments,
} from './components/GuessedLocation';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import { getInitialState, MAPEAMENTO_HEARTS } from './utils/helpers';
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
    showResults,
    setShowResults,
    score,
    progress,
    isWin,
    isComplete,
    hasFoundAllLetters,
    submitLocation,
  } = useMapeamentoEngine(data, initialState);

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
      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>{gameInfo.name.pt}</Title>
        <Text type="secondary">Que lugar é esse?</Text>
      </div>

      <GameStatsRow>
        <GameStat
          icon={Repeat}
          value={`${guesses.length}/${MAPEAMENTO_HEARTS}`}
          label="Tentativas usadas"
        />

        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={MAPEAMENTO_HEARTS}
            size={16}
          />
        </div>

        <GameStat
          icon={Lightbulb}
          value={`${availableClues.length}/${allClues.length}`}
          label="Pistas liberadas"
          align="end"
        />
      </GameStatsRow>

      {!isComplete && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
      )}

      <div className="rounded-[2rem] bg-card px-5 py-5 shadow-sm">
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
      </div>

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
        <div
          className={`rounded-[2rem] px-5 py-5 text-center shadow-sm ${
            isWin ? 'bg-gold-soft' : 'bg-card'
          }`}
        >
          <Text type="secondary">O lugar é:</Text>
          <div className="mt-2">
            <Title level={4}>{data.location}</Title>
          </div>
        </div>
      )}

      {!isComplete && (
        <div className="flex flex-col gap-3 rounded-[2rem] bg-card px-5 py-5 shadow-sm">
          <GuessedLocation
            typedLocation={typedLocation}
            fragments={locationFragments}
          />

          <TextInput
            value={typedLocation}
            onChange={(event) => setTypedLocation(event.target.value)}
            placeholder="Digite seu palpite"
            aria-label="Digite seu palpite para o lugar"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="flex gap-3">
            <Button
              variant="primary"
              size="small"
              onClick={handleSubmit}
              disabled={!typedLocation.trim()}
            >
              Tentar
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTypedLocation('')}
              disabled={!typedLocation}
            >
              Limpar
            </Button>
          </div>
        </div>
      )}

      {locationFragments.includes('_') && !isComplete && (
        <Text
          type="secondary"
          className="text-center text-sm"
        >
          O fragmento mostra letras que já apareceram nas suas tentativas. Os
          espaços cinza ainda podem ser letras ou espaços reais.
        </Text>
      )}

      {guesses.length > 0 && (
        <div className="rounded-[2rem] bg-card px-5 py-5 shadow-sm">
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
        </div>
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
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
