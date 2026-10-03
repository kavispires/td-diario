import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Button } from '@components/ui/Button';
import { Pill } from '@components/ui/Pill';
import { Surface } from '@components/ui/Surface';
import { Paragraph, Text, Title } from '@components/ui/Typography';
import { BrushCleaning, Check, Coins, LoaderCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { DailyPicacoEntry } from 'types/games';
import { Canvas } from './components/Canvas';
import { ResultsSplash } from './components/ResultsSplash';
import { gameInfo } from './info';
import { DRAWINGS_COUNT, ROUND_DURATION_SECONDS } from './utils/constants';
import { countAcceptedDrawings, getInitialState } from './utils/helpers';
import { usePicacoEngine } from './utils/usePicacoEngine';

/**
 * Props accepted by the {@link DailyPicacoGame} component.
 */
type DailyPicacoGameProps = {
  /**
   * Today's Picaco payload, as resolved by `GameScreen`.
   */
  data: DailyPicacoEntry;
};

/**
 * Renders a full day of Picaco: intro, timed drawing rounds, save/retry
 * states, and a fullscreen results splash once the contribution is saved.
 *
 * @param props Today's Picaco payload.
 * @returns The rendered Picaco game.
 */
export function DailyPicacoGame({ data }: DailyPicacoGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    selectedCards,
    currentCard,
    currentCardNumber,
    completedDrawings,
    showResults,
    setShowResults,
    progress,
    score,
    isIdle,
    isPlaying,
    isSaving,
    isRetryable,
    isWin,
    submitDrawing,
    retrySave,
    startGame,
  } = usePicacoEngine(data, initialState);

  const acceptedDrawings = useMemo(
    () => countAcceptedDrawings(completedDrawings),
    [completedDrawings],
  );
  const totalRounds = selectedCards.length;
  const finishedRounds = completedDrawings.length;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      <GameStatsRow
        progress={isWin ? 1 : progress}
        color={gameInfo.color}
      >
        <GameStat
          icon={BrushCleaning}
          value={`${finishedRounds}/${totalRounds}`}
          label="Desenhos concluídos"
        />
        <GameStat
          icon={Check}
          value={`${acceptedDrawings}`}
          label="Desenhos aproveitados"
          align="center"
        />
        <GameStat
          icon={Coins}
          value={score}
          label="Pontuação"
          align="end"
        />
      </GameStatsRow>

      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>{gameInfo.name.pt}</Title>
        <Text type="secondary">
          Desenhe rápido e ajude o TD com novos rabiscos.
        </Text>
      </div>

      {isIdle && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-6 text-center">
          <Paragraph className="mb-0 text-center">
            Você terá <strong>{ROUND_DURATION_SECONDS} segundos</strong> para
            cada desenho, sem usar letras nem números. Depois do{' '}
            <strong>{DRAWINGS_COUNT}º rabisco</strong>, tudo é salvo de uma vez.
          </Paragraph>

          <div className="grid w-full gap-3 rounded-3xl bg-primary-soft px-4 py-4 text-left">
            <Text>1. Leia a expressão.</Text>
            <Text>2. Desenhe o mais claro que conseguir.</Text>
            <Text>3. Deixe o tempo acabar para avançar.</Text>
          </div>

          <Button
            variant="primary"
            size="small"
            onClick={startGame}
          >
            Começar
          </Button>
        </Surface>
      )}

      {isPlaying && currentCard && (
        <>
          <Pill>Desenho #{currentCardNumber}</Pill>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard.id}
              className="flex w-full flex-col gap-3 rounded-[2rem] bg-gold-soft px-5 py-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Text
                type="secondary"
                className="text-sm"
              >
                Sem letras ou números
              </Text>
              <Title level={4}>{currentCard.text}</Title>
            </motion.div>
          </AnimatePresence>

          <Canvas
            key={currentCard.id}
            onComplete={submitDrawing}
          />
        </>
      )}

      {isSaving && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-8 text-center">
          <LoaderCircle
            className="h-8 w-8 animate-spin text-primary"
            aria-hidden="true"
          />
          <Title level={4}>Salvando seus desenhos</Title>
          <Text type="secondary">
            Estamos enviando os rabiscos de hoje para o banco de dados.
          </Text>
        </Surface>
      )}

      {isRetryable && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-8 text-center">
          <Title level={4}>Não deu para salvar agora</Title>
          <Text type="secondary">
            Seus desenhos continuam aqui. Tente enviar de novo quando a conexão
            estabilizar.
          </Text>
          <Button
            variant="primary"
            size="small"
            onClick={retrySave}
          >
            Tentar novamente
          </Button>
        </Surface>
      )}

      {isWin && !showResults && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-gold-soft px-5 py-6 text-center">
          <Title level={4}>Você já desenhou hoje!</Title>
          <Text type="secondary">
            Seus rabiscos já foram enviados. Se quiser, abra o resumo para rever
            o que saiu.
          </Text>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowResults(true)}
          >
            Ver resultado
          </Button>
        </Surface>
      )}

      {showResults && (
        <ResultsSplash
          cards={selectedCards}
          drawings={completedDrawings}
          score={score}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
