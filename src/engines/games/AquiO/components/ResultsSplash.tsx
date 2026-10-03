import { DailyItem } from '@components/games/DailyItem';
import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Text } from '@components/ui/Typography';
import { motion } from 'motion/react';
import type { RoundStopType } from '../utils/types';

const TITLES = [
  'Você é muito ruim!',
  'Foi bem mais ou menos!',
  'Muito bom!',
  'Quase lá!',
  'Incrível!',
] as const;

function getResultsTitle(progress: number, hearts: number): string {
  if (progress <= 3 || hearts === 0) return TITLES[0];
  if (progress <= 10) return TITLES[1];
  if (progress <= 12) return TITLES[2];
  if (progress < 15) return TITLES[3];
  return TITLES[4];
}

function getResultsMessage(
  stopType: RoundStopType,
  bestProgress: number,
  progress: number,
): string {
  if (stopType === 'win') {
    return 'Você encontrou todos os 15 itens em comum de hoje. Pode guardar a lupa.';
  }

  if (stopType === 'lose') {
    return `Seu melhor hoje foi ${bestProgress} discos. Amanhã tem revanche.`;
  }

  if (stopType === 'timeout') {
    if (bestProgress > progress) {
      return `O tempo acabou. Sua melhor corrida continua sendo ${bestProgress} discos.`;
    }

    return 'O tempo acabou, mas ainda dá para tentar outra vez enquanto sobra coração.';
  }

  return `Seu melhor hoje foi ${bestProgress} discos. Quando quiser, abra outra rodada.`;
}

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether today's game has already been won.
   */
  win: boolean;
  /**
   * Whether today's game ended because the player lost every heart.
   */
  lose: boolean;
  /**
   * How the latest round stopped.
   */
  stopType: RoundStopType;
  /**
   * Remaining hearts after the latest round.
   */
  hearts: number;
  /**
   * Progress reached in the latest round.
   */
  progress: number;
  /**
   * Best progress reached across all attempts today.
   */
  bestProgress: number;
  /**
   * Number of discs required to win today's challenge.
   */
  goal: number;
  /**
   * Number of attempts used today.
   */
  attempts: number;
  /**
   * Score accumulated so far.
   */
  score: number;
  /**
   * Today's item pool, used for the recap strip.
   */
  itemsIds: string[];
  /**
   * Latest correctly matched item id, when one exists.
   */
  lastMatch: string;
  /**
   * Whether the round is using challenge mode.
   */
  hardMode: boolean;
  /**
   * Title describing today's item set.
   */
  title: string;
  /**
   * Called to dismiss the splash and return to the game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Aqui O results splash shown whenever a round ends: recaps the
 * latest run, today's best progress, and the active mode, then lets the
 * player either close the overlay or return to the Hub.
 *
 * @param props Result data and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  lose,
  stopType,
  hearts,
  progress,
  bestProgress,
  goal,
  attempts,
  score,
  itemsIds,
  lastMatch,
  hardMode,
  title,
  onClose,
}: ResultsSplashProps) {
  const usedProgress = stopType === 'idle' ? bestProgress : progress;
  const titleText = getResultsTitle(usedProgress, hearts);
  const previewItems = itemsIds
    .filter((itemId) => itemId !== lastMatch)
    .slice(0, Math.max(0, Math.floor((usedProgress - 1) / 3)));

  return (
    <GameResultsSplash
      gameId="aqui-o"
      title={win ? 'Parabéns!' : lose ? 'Que pena!' : titleText}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        {title}
      </Text>

      <div
        className={`w-full rounded-[2rem] px-5 py-4 text-center shadow-sm ${
          win ? 'bg-gold-soft' : 'bg-white/75'
        }`}
      >
        <Text
          strong
          className="text-sm uppercase tracking-[0.18em]"
        >
          Resumo da rodada
        </Text>

        <div className="mt-3 grid grid-cols-2 gap-3 text-left">
          <div className="rounded-2xl bg-background/80 px-4 py-3 shadow-sm">
            <Text
              strong
              className="block text-lg"
            >
              {usedProgress}/{goal}
            </Text>
            <Text
              type="secondary"
              className="text-xs"
            >
              Discos alcançados
            </Text>
          </div>

          <div className="rounded-2xl bg-background/80 px-4 py-3 shadow-sm">
            <Text
              strong
              className="block text-lg"
            >
              {score}
            </Text>
            <Text
              type="secondary"
              className="text-xs"
            >
              Pontos no dia
            </Text>
          </div>

          <div className="rounded-2xl bg-background/80 px-4 py-3 shadow-sm">
            <Text
              strong
              className="block text-lg"
            >
              {attempts}
            </Text>
            <Text
              type="secondary"
              className="text-xs"
            >
              Tentativas
            </Text>
          </div>

          <div className="rounded-2xl bg-background/80 px-4 py-3 shadow-sm">
            <Text
              strong
              className="block text-lg"
            >
              {hardMode ? 'Difícil' : 'Normal'}
            </Text>
            <Text
              type="secondary"
              className="text-xs"
            >
              Modo atual
            </Text>
          </div>
        </div>
      </div>

      <Hearts
        remaining={hearts}
        total={3}
        emptyClassName="text-black"
      />

      <Text
        type="secondary"
        className="text-center"
      >
        {getResultsMessage(stopType, bestProgress, progress)}
      </Text>

      {(lastMatch || previewItems.length > 0) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {lastMatch && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="rounded-full border border-primary bg-white/70 p-1 shadow-sm"
            >
              <DailyItem
                itemId={lastMatch}
                width={46}
              />
            </motion.div>
          )}

          {previewItems.map((itemId, index) => (
            <motion.div
              key={itemId}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              className="rounded-full bg-white/50 p-1 shadow-sm"
            >
              <DailyItem
                itemId={itemId}
                width={42}
              />
            </motion.div>
          ))}
        </div>
      )}
    </GameResultsSplash>
  );
}
