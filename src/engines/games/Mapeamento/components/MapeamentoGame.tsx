import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { Keyboard } from '@components/games/Keyboard';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { Coins, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { DailyMapeamentoEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  HEADER_HEARTS_SIZE,
  LOCATION_FRAGMENT_PLACEHOLDER,
  MAPEAMENTO_HEARTS,
} from '../utils/constants';
import type { GameState } from '../utils/types';
import { useMapeamentoEngine } from '../utils/useMapeamentoEngine';
import { GuessedLocation, LocationFragments } from './GuessedLocation';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link MapeamentoGame} component.
 */
export type MapeamentoGameProps = {
  /**
   * Today's Mapeamento payload, as resolved by `GameScreen`.
   */
  data: DailyMapeamentoEntry;
  /**
   * Initial persisted game state restored for today's challenge.
   */
  initialState: GameState;
};

/**
 * Renders the interactive Mapeamento game body using a precomputed initial
 * state from the daily wrapper.
 *
 * @param props Today's Mapeamento payload and restored initial state.
 * @returns The rendered Mapeamento game body.
 */
export function MapeamentoGame({ data, initialState }: MapeamentoGameProps) {
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
          icon={Lightbulb}
          value={`${availableClues.length}/${allClues.length}`}
          label="Pistas liberadas"
        />
        <div className="flex items-center justify-center">
          <Hearts
            remaining={hearts}
            total={MAPEAMENTO_HEARTS}
            size={HEADER_HEARTS_SIZE}
          />
        </div>

        <GameStat
          icon={Coins}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <GameTitle title="Que lugar é esse?" />

      <ul className="grid gap-1">
        {allClues.map((clue, index) => {
          const isAvailable = availableClues.includes(clue);

          if (!isComplete && !isAvailable) {
            return null;
          }

          return (
            <li
              key={`${index}-${clue}`}
              className={`grid grid-cols-[2rem_1fr] items-start gap-0 rounded-2xl px-1 py-1 ${
                isAvailable ? 'bg-primary-soft' : 'bg-border/70 opacity-70'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-semibold text-foreground">
                {index + 1}
              </span>
              <Text className="leading-relaxed">{clue}</Text>
            </li>
          );
        })}
      </ul>

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
          className={`p-2 text-center ${isWin ? 'bg-gold-soft' : 'bg-card'}`}
        >
          <Text type="secondary">O lugar é:</Text>
          <div className="mt-2">
            <Title level={4}>{data.location}</Title>
          </div>
        </Surface>
      )}

      <div className="flex flex-col items-center gap-4">
        <SeeResultsButton
          isComplete={isComplete}
          setShowResults={setShowResults}
        />
      </div>

      {!isComplete && (
        <div className="flex flex-col gap-2">
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
            incorrectClassName="bg-border-strong"
            getAriaLabel={(key) => `Digitar ${key.toUpperCase()}`}
          />
        </div>
      )}

      {locationFragments.includes(LOCATION_FRAGMENT_PLACEHOLDER) &&
        !isComplete && (
          <Text
            type="secondary"
            className="text-center text-sm"
          >
            O fragmento acima mostra as letras que você já acertou; as barras
            cinzas{' '}
            <span
              className="inline-block h-4 w-6 rounded-full bg-border-strong align-middle"
              aria-hidden="true"
            />{' '}
            ainda podem ser letras ou espaços que você não acertou.
          </Text>
        )}

      {guesses.length > 0 && (
        <Surface className="bg-card px-5 py-5 ">
          <Title
            level={5}
            className="mb-3 text-center"
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

      {showResults && (
        <ResultsSplash
          win={isWin}
          hearts={hearts}
          location={data.location}
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
