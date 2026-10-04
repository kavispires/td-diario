import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { Coins, Repeat, Send } from 'lucide-react';
import type { DailyPortaisEntry } from 'types/games';
import { gameInfo } from '../info';
import { DEFAULT_HEARTS } from '../utils/constants';
import { getTotalMoves } from '../utils/helpers';
import type { GameState } from '../utils/types';
import { usePortaisEngine } from '../utils/usePortaisEngine';
import { Corridor } from './Corridor';
import { Passcode } from './Passcode';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link PortaisGame} component.
 */
type PortaisGameProps = {
  /**
   * Today's Portais payload, as resolved by `GameScreen`.
   */
  data: DailyPortaisEntry;
  /**
   * The day's persisted (or freshly created) game state.
   */
  initialState: GameState;
};

/**
 * Renders a full day of Portais: the corridor previews, rotating passcode
 * columns, guess history, and a results splash once the run ends in a win
 * or loss.
 *
 * @param props Today's Portais payload and initial state.
 * @returns The rendered Portais game.
 */
export function PortaisGame({ data, initialState }: PortaisGameProps) {
  const {
    hearts,
    guesses,
    moves,
    score,
    currentCorridorIndex,
    currentCorridor,
    currentCorridorIndexes,
    progress,
    currentGuess,
    latestGuess,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    onSlideWordPosition,
    onSubmitPasscode,
  } = usePortaisEngine(data, initialState);
  const [imageWidth, containerRef] = useCardWidthByContainerRef(
    Math.min(Math.max(currentCorridor?.imagesIds.length ?? 3, 1), 3),
    {
      margin: 24,
      gap: 16,
      maxWidth: 210,
      minWidth: 88,
    },
  );

  const totalMoves = getTotalMoves(moves);
  const completedCorridors = isWin
    ? data.corridors.length
    : currentCorridorIndex;
  const latestGuesses = guesses[currentCorridorIndex] ?? [];

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
    >
      <GameStatsRow
        progress={progress}
        color={gameInfo.color}
      >
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

      {currentCorridor && !isComplete && (
        <div className="flex w-full flex-col gap-4 bg-card px-5 py-6">
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
        </div>
      )}

      {isComplete && (
        <div className="grid w-full gap-4">
          {data.corridors.map((corridor, index) => (
            <Surface
              key={corridor.passcode}
              className="bg-card px-3 py-3"
            >
              <Corridor
                number={index + 1}
                totalCorridors={data.corridors.length}
                imagesIds={corridor.imagesIds}
                width={Math.max(imageWidth * 0.4, 72)}
                passcode={corridor.passcode}
                moves={moves[index] ?? 0}
                solved={index < completedCorridors}
              />
            </Surface>
          ))}
        </div>
      )}

      <SeeResultsButton
        isComplete={isComplete}
        setShowResults={setShowResults}
      />

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
