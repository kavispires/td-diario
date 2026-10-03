import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Switch } from '@components/ui/Switch';
import { Text, Title } from '@components/ui/Typography';
import {
  ChevronLeft,
  ChevronRight,
  Coins,
  FileText,
  LoaderCircle,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { DailyTaNaCaraEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { ResultsSplash } from './components/ResultsSplash';
import { SuspectChoiceCard } from './components/SuspectChoiceCard';
import { gameInfo } from './info';
import { getInitialState } from './utils/helpers';
import { useTaNaCaraEngine } from './utils/useTaNaCaraEngine';

/**
 * Props accepted by the {@link DailyTaNaCaraGame} component.
 */
type DailyTaNaCaraGameProps = {
  /**
   * Today's Ta Na Cara payload, as resolved by `GameScreen`.
   */
  data: PlaceholderGameData;
};

const VARIANT_OPTIONS = ['gb', 'rl', 'px', 'fx'] as const;

/**
 * Narrowly validates the shared placeholder payload before Ta Na Cara starts
 * reading its game-specific fields.
 *
 * @param data - Daily payload received from the shared `GameScreen` registry.
 * @returns Whether the payload matches the Ta Na Cara shape.
 */
function isDailyTaNaCaraEntry(
  data: PlaceholderGameData,
): data is DailyTaNaCaraEntry {
  return (
    data.type === 'ta-na-cara' &&
    Array.isArray(data.testimonies) &&
    Array.isArray(data.suspectsIds)
  );
}

/**
 * Renders a full day of Ta Na Cara: intro, testimony rounds, contribution
 * saving states, and a fullscreen results splash once the answers are saved.
 *
 * @param props Today's Ta Na Cara payload.
 * @returns The rendered Ta Na Cara game.
 */
export function DailyTaNaCaraGame({ data }: DailyTaNaCaraGameProps) {
  if (!isDailyTaNaCaraEntry(data)) {
    return (
      <Alert
        type="error"
        message="Não conseguimos carregar o desafio de Tá Na Cara de hoje."
        description="Atualize a página para tentar novamente."
        showIcon
        className="mx-auto w-full max-w-md"
      />
    );
  }

  return <TaNaCaraGameContent data={data} />;
}

/**
 * Props accepted by the internal, fully narrowed Ta Na Cara content
 * component.
 */
type TaNaCaraGameContentProps = {
  /**
   * Today's validated Ta Na Cara payload.
   */
  data: DailyTaNaCaraEntry;
};

/**
 * Renders the playable Ta Na Cara screen once the shared placeholder payload
 * has been narrowed to the game's real data shape.
 *
 * @param props Today's validated Ta Na Cara payload.
 * @returns The rendered Ta Na Cara game content.
 */
function TaNaCaraGameContent({ data }: TaNaCaraGameContentProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    currentQuestion,
    currentAnswers,
    suspects,
    questionNumber,
    totalQuestions,
    answeredQuestions,
    markedAnswers,
    showResults,
    setShowResults,
    progress,
    score,
    mode,
    variant,
    isIdle,
    isPlaying,
    isSaving,
    isRetryable,
    isWin,
    canGoNext,
    canGoPrevious,
    canSubmit,
    submitLabel,
    resultQuestions,
    toggleNsfwMode,
    updateAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    submitAnswers,
    retrySave,
    startGame,
    changeVariant,
    getSuspectName,
  } = useTaNaCaraEngine(data, initialState);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      <GameStatsRow>
        <GameStat
          icon={FileText}
          value={`${answeredQuestions}/${totalQuestions}`}
          label="Depoimentos com respostas mínimas"
        />
        <GameStat
          icon={Users}
          value={markedAnswers}
          label="Personagens avaliados"
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
          Julgue pela cara, marque quem combina com cada depoimento e ajude a
          treinar o banco do TD.
        </Text>
      </div>

      {!isWin && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
        </div>
      )}

      {isSaving && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-8 text-center">
          <LoaderCircle
            className="h-8 w-8 animate-spin text-primary"
            aria-hidden="true"
          />
          <Title level={4}>Salvando suas respostas</Title>
          <Text type="secondary">
            Estamos enviando os depoimentos de hoje para o banco do TD.
          </Text>
        </Surface>
      )}

      {isIdle && !isWin && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-card px-5 py-6 text-center">
          <Text>
            Você verá uma sequência de depoimentos e deverá marcar quem combina
            com cada frase. Se bater dúvida, deixe em branco.
          </Text>

          <div className="grid w-full gap-3 rounded-3xl bg-primary-soft px-4 py-4 text-left">
            <Text>1. Leia o depoimento.</Text>
            <Text>2. Toque em Sim ou Não para cada personagem.</Text>
            <Text>3. Avalie pelo menos 4 pessoas por rodada.</Text>
            <Text>4. Depois de 6 depoimentos, já dá para salvar.</Text>
          </div>

          <div className="flex w-full items-center justify-between gap-4 rounded-2xl bg-background px-4 py-3 text-left shadow-sm">
            <div className="min-w-0">
              <Text strong>Conteúdo sensível</Text>
              <div>
                <Text
                  type="secondary"
                  className="text-sm"
                >
                  {mode === 'nsfw'
                    ? 'Perguntas sensíveis entram na rodada.'
                    : 'Só entram perguntas sem conteúdo sensível.'}
                </Text>
              </div>
            </div>
            <Switch
              checked={mode === 'nsfw'}
              onChange={toggleNsfwMode}
              aria-label="Alternar conteúdo sensível"
            />
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

      {isPlaying && currentQuestion && currentAnswers && (
        <>
          <div className="flex w-full items-center justify-between gap-3">
            <Text
              strong
              className="text-sm"
            >
              Depoimento {questionNumber} de {totalQuestions}
            </Text>
            <Text
              type="secondary"
              className="text-sm"
            >
              Mínimo: 4 respostas
            </Text>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.testimonyId}
              className="flex w-full flex-col gap-3 rounded-[2rem] bg-gold-soft px-5 py-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {currentQuestion.nsfw && (
                <Text
                  strong
                  className="text-sm uppercase tracking-wide text-foreground"
                >
                  Conteúdo sensível
                </Text>
              )}
              <Title level={4}>{currentQuestion.question}</Title>
              <Text
                type="secondary"
                className="text-sm"
              >
                Toque novamente no mesmo botão para limpar a resposta.
              </Text>
            </motion.div>
          </AnimatePresence>

          <div className="grid w-full grid-cols-2 gap-3">
            {suspects.map((suspectId) => (
              <SuspectChoiceCard
                key={`${currentQuestion.testimonyId}-${suspectId}`}
                suspectId={suspectId}
                variant={variant}
                name={getSuspectName(suspectId)}
                answer={currentAnswers.answers[suspectId] ?? null}
                onAnswerChange={(answer) => updateAnswer(suspectId, answer)}
              />
            ))}
          </div>

          {!canGoNext && !canSubmit && (
            <Alert
              type="warning"
              message="Você precisa avaliar pelo menos 4 personagens para avançar."
              description="Se não souber opinar sobre alguém, deixe essa pessoa em branco e responda outras."
              showIcon
              className="w-full"
            />
          )}

          {isRetryable && (
            <Alert
              type="error"
              message="Não conseguimos salvar suas respostas agora."
              description="Você pode tentar novamente sem perder o que já marcou."
              showIcon
              className="w-full"
            />
          )}

          {questionNumber >= Math.min(6, totalQuestions) &&
            questionNumber < totalQuestions && (
              <Alert
                type="info"
                message="Você já respondeu o mínimo necessário."
                description="Se cansou, já pode salvar agora ou continuar avaliando mais depoimentos."
                showIcon
                className="w-full"
              />
            )}

          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="outlined"
              size="small"
              icon={<ChevronLeft aria-hidden="true" />}
              onClick={goToPreviousQuestion}
              disabled={!canGoPrevious}
            >
              Anterior
            </Button>
            <Button
              variant="outlined"
              size="small"
              icon={<ChevronRight aria-hidden="true" />}
              iconPlacement="end"
              onClick={goToNextQuestion}
              disabled={!canGoNext}
            >
              Próximo
            </Button>
          </div>

          {questionNumber >= Math.min(6, totalQuestions) && (
            <Button
              variant="primary"
              size="small"
              block
              onClick={isRetryable ? retrySave : submitAnswers}
              disabled={!canSubmit}
            >
              {isRetryable ? 'Tentar novamente' : submitLabel}
            </Button>
          )}
        </>
      )}

      {isWin && !showResults && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-gold-soft px-5 py-6 text-center">
          <Title level={4}>Você já respondeu hoje!</Title>
          <Text type="secondary">
            Sua contribuição foi salva. Abra o resumo para rever os depoimentos
            e respostas marcadas.
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

      {!isWin && (
        <Surface className="flex w-full flex-col gap-3 bg-card px-5 py-5">
          <Text
            strong
            className="text-center"
          >
            Experimente em outros estilos
          </Text>
          <div className="grid grid-cols-4 gap-2">
            {VARIANT_OPTIONS.map((option) => (
              <Button
                key={option}
                variant={variant === option ? 'primary' : 'outlined'}
                size="small"
                block
                onClick={() => changeVariant(option)}
              >
                {option.toUpperCase()}
              </Button>
            ))}
          </div>
        </Surface>
      )}

      {showResults && (
        <ResultsSplash
          questions={resultQuestions}
          score={score}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
