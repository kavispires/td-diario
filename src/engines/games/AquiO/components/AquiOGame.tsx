import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { GameTitle } from '@components/games/GameTitle';
import { Hearts } from '@components/games/Hearts';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Button } from '@components/ui/Button';
import { DualTranslate } from '@components/ui/DualTranslate';
import { Segmented } from '@components/ui/Segmented';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { useDualTranslate } from '@hooks/useDualTranslate';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { Clock3, Coins, Disc3 } from 'lucide-react';
import type { DailyAquiOEntry } from 'types/games';
import { gameInfo } from '../info';
import { HEARTS, ROUND_DURATION_SECONDS } from '../utils/constants';
import type { GameState } from '../utils/types';
import { useAquiOEngine } from '../utils/useAquiOEngine';
import { Disc } from './Disc';
import { PreloadItems } from './PreloadItems';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link AquiOGame} component.
 */
export type AquiOGameProps = {
  /**
   * Today's Aqui O payload, as resolved by `GameScreen`.
   */
  data: DailyAquiOEntry;
  /**
   * Persisted state restored for today's Aqui O session.
   */
  initialState: GameState;
};

/**
 * Renders the full interactive Aqui O experience for a given day using the
 * already-restored initial state passed by the entry component.
 *
 * @param props Today's Aqui O payload and restored state.
 * @returns The rendered Aqui O game.
 */
export function AquiOGame({ data, initialState }: AquiOGameProps) {
  const translate = useDualTranslate();
  const dailyChallenges = useGetDailyChallenges();
  const itemLabels = dailyChallenges.data?.metadata?.dictionary ?? {};
  const {
    hearts,
    attempts,
    maxProgress,
    goal,
    score,
    maxScore,
    discIndex,
    discA,
    discB,
    result,
    isWin,
    isLose,
    isComplete,
    isPlaying,
    timeLeft,
    mode,
    onModeChange,
    voice,
    onVoiceChange,
    onStart,
    onSelect,
    showResults,
    setShowResults,
    stopType,
  } = useAquiOEngine(data, initialState, itemLabels);
  const [discWidth, containerRef] = useCardWidthByContainerRef(1, {
    gap: 0,
    margin: 0,
    maxWidth: 320,
    minWidth: 220,
  });

  const progress = isPlaying ? discIndex : maxProgress;
  const timerShare =
    isPlaying && ROUND_DURATION_SECONDS > 0
      ? Math.max(0, Math.min(1, timeLeft / ROUND_DURATION_SECONDS))
      : 0;

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 pb-8 pt-2"
    >
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <GameStatsRow
          progress={isComplete ? 1 : progress / goal}
          color={gameInfo.color}
        >
          <GameStat
            icon={Disc3}
            value={`${progress}/${goal}`}
            label="Discos encontrados"
          />

          <div className="flex items-center justify-center">
            <Hearts
              remaining={hearts}
              total={HEARTS}
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
          title={<DualTranslate>{data.title}</DualTranslate>}
          description="Encontre o item que aparece nos dois discos antes que o tempo acabe."
        />

        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm">
          <div className="h-3 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${timerShare * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-1">
            <Clock3
              className="h-4 w-4 text-subtle-foreground"
              aria-hidden="true"
            />
            <Text className="text-sm tabular-nums">
              {Math.ceil(isPlaying ? timeLeft : 0)}s
            </Text>
          </div>
        </div>
      </div>

      {!isPlaying && (
        <div className="flex w-full flex-col items-center gap-4">
          <Button
            variant="primary"
            size="small"
            onClick={onStart}
            disabled={isComplete}
          >
            {attempts > 0 ? 'Tentar de novo' : 'Começar o desafio'}
          </Button>

          <Segmented
            label="Modo:"
            labelPlacement="left"
            value={mode}
            onChange={(value) => onModeChange(value as 'normal' | 'challenge')}
            disabled={isPlaying || isComplete}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'challenge', label: 'Difícil' },
            ]}
          />

          <Segmented
            label="Voz:"
            labelPlacement="left"
            value={voice}
            onChange={(value) => onVoiceChange(value as 'on' | 'off')}
            options={[
              { value: 'off', label: 'Sem' },
              { value: 'on', label: 'Com' },
            ]}
          />

          <Surface className="w-full p-4">
            <PreloadItems
              items={data.itemsIds}
              itemLabels={itemLabels}
            />
          </Surface>
        </div>
      )}

      {isPlaying && discA && discB && (
        <div className="flex w-full flex-col items-center gap-4">
          {[discA, discB].map((disc, slotIndex) => (
            <Disc
              key={disc.id}
              disc={disc}
              width={discWidth}
              onSelect={onSelect}
              animationDelay={slotIndex === 1 ? 0.12 : 0}
            />
          ))}
        </div>
      )}

      {!isPlaying && attempts > 0 && !showResults && (
        <SeeResultsButton
          isComplete={attempts > 0}
          setShowResults={setShowResults}
        />
      )}

      {!isPlaying && showResults && (
        <ResultsSplash
          win={isWin}
          lose={isLose}
          stopType={stopType}
          hearts={hearts}
          progress={discIndex}
          bestProgress={maxProgress}
          goal={goal}
          attempts={attempts}
          score={score}
          maxScore={maxScore}
          itemsIds={data.itemsIds}
          lastMatch={result}
          hardMode={mode === 'challenge'}
          title={translate(data.title)}
          challengeNumber={data.number}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
