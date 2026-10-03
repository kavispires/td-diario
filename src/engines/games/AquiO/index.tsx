import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Hearts } from '@components/games/Hearts';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { useDualTranslate } from '@hooks/useDualTranslate';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { Clock3, Coins, Disc3 } from 'lucide-react';
import { useState } from 'react';
import type { DailyAquiOEntry } from 'types/games';
import { Disc } from './components/Disc';
import { PreloadItems } from './components/PreloadItems';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import { HEARTS, ROUND_DURATION_SECONDS } from './utils/constants';
import { getInitialState } from './utils/helpers';
import { useAquiOEngine } from './utils/useAquiOEngine';

/**
 * Props accepted by the {@link DailyAquiOGame} component.
 */
type DailyAquiOGameProps = {
  /**
   * Today's Aqui O payload, as resolved by `GameScreen`.
   */
  data: DailyAquiOEntry;
};

/**
 * Renders a full day of Aqui O: the stacked discs, the timed round flow,
 * and a fullscreen results splash once a round ends.
 *
 * @param props Today's Aqui O payload.
 * @returns The rendered Aqui O game.
 */
export function DailyAquiOGame({ data }: DailyAquiOGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const translate = useDualTranslate();
  const dailyChallenges = useGetDailyChallenges();
  const itemLabels = dailyChallenges.data?.metadata?.dictionary ?? {};
  const {
    hearts,
    attempts,
    maxProgress,
    goal,
    score,
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

        <Text strong>{translate(data.title)}</Text>

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

        <Text
          type="secondary"
          className="text-center"
        >
          Encontre o item que aparece nos dois discos antes que o tempo acabe.
          <br />
          {attempts === 0
            ? `Hoje são ${goal} discos para achar com apenas ${HEARTS} corações.`
            : `Melhor rodada de hoje: ${maxProgress} de ${goal} discos em ${attempts} tentativa${attempts === 1 ? '' : 's'}.`}
        </Text>
      </div>

      {!isPlaying && (
        <Surface className="flex w-full flex-col items-center gap-3 bg-white/70 px-4 py-4">
          <Button
            variant="primary"
            size="small"
            onClick={onStart}
            disabled={isComplete}
          >
            {attempts > 0 ? 'Tentar de novo' : 'Começar o desafio'}
          </Button>

          <div className="flex w-full flex-wrap justify-center gap-2">
            <Button
              variant={mode === 'normal' ? 'primary' : 'outlined'}
              size="small"
              aria-pressed={mode === 'normal'}
              onClick={() => onModeChange('normal')}
              disabled={isPlaying || isComplete}
            >
              Modo normal
            </Button>
            <Button
              variant={mode === 'challenge' ? 'primary' : 'outlined'}
              size="small"
              aria-pressed={mode === 'challenge'}
              onClick={() => onModeChange('challenge')}
              disabled={isPlaying || isComplete}
            >
              Modo difícil
            </Button>
          </div>

          <div className="flex w-full flex-wrap justify-center gap-2">
            <Button
              variant={voice === 'off' ? 'primary' : 'outlined'}
              size="small"
              aria-pressed={voice === 'off'}
              onClick={() => onVoiceChange('off')}
            >
              Sem voz
            </Button>
            <Button
              variant={voice === 'on' ? 'primary' : 'outlined'}
              size="small"
              aria-pressed={voice === 'on'}
              onClick={() => onVoiceChange('on')}
            >
              Com voz
            </Button>
          </div>

          <PreloadItems
            items={data.itemsIds}
            itemLabels={itemLabels}
          />
        </Surface>
      )}

      {isPlaying && discA && discB && (
        <div className="flex w-full flex-col items-center gap-4">
          <Disc
            disc={discA}
            width={discWidth}
            onSelect={onSelect}
            animationDelay={0}
          />
          <Disc
            disc={discB}
            width={discWidth}
            onSelect={onSelect}
            animationDelay={0.12}
          />
        </div>
      )}

      {!isPlaying && attempts > 0 && !showResults && (
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowResults(true)}
        >
          Ver resultado
        </Button>
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
