import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { useTDImageCardUrl } from '@hooks/useTDImageCardUrl';
import { Check, Coins, MoveHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { DailyVitraisInfinitosEntry } from 'types/games';
import type { PlaceholderGameData } from 'types/puzzles';
import { PuzzleBoard } from './components/PuzzleBoard';
import { ResultsSplash } from './components/ResultsSplash';
import { getInitialState } from './utils/helpers';
import { useVitraisInfinitosEngine } from './utils/useVitraisInfinitosEngine';

/**
 * Props accepted by the {@link DailyVitraisInfinitosGame} component.
 */
type DailyVitraisInfinitosGameProps = {
  /**
   * Today's Vitrais Infinitos payload, as resolved dynamically by
   * `GameScreen`.
   */
  data: PlaceholderGameData;
};

const FALLBACK_ENTRY: DailyVitraisInfinitosEntry = {
  id: 'invalid-vitrais-infinitos-entry',
  number: 0,
  type: 'vitrais-infinitos',
  title: '',
  cardId: '',
  pieces: [0, 1, 2, 3, 4, 5],
};

/**
 * Narrows the shared placeholder payload to the concrete shape expected by
 * Vitrais Infinitos.
 *
 * @param data - Dynamic daily payload received from `GameScreen`.
 * @returns Whether the payload matches Vitrais Infinitos's final model.
 */
function isDailyVitraisInfinitosEntry(
  data: PlaceholderGameData,
): data is DailyVitraisInfinitosEntry {
  return (
    data.type === 'vitrais-infinitos' &&
    typeof data.title === 'string' &&
    typeof data.cardId === 'string' &&
    Array.isArray(data.pieces) &&
    data.pieces.every((pieceId) => typeof pieceId === 'number')
  );
}

/**
 * Renders a full day of Vitrais Infinitos: the draggable stained-glass
 * puzzle, its progress stats, and a fullscreen results splash once the
 * image is fully reconstructed.
 *
 * @param props Today's Vitrais Infinitos payload.
 * @returns The rendered Vitrais Infinitos game.
 */
export function DailyVitraisInfinitosGame({
  data,
}: DailyVitraisInfinitosGameProps) {
  const entry = isDailyVitraisInfinitosEntry(data) ? data : FALLBACK_ENTRY;

  const [initialState] = useState(() => getInitialState(entry));
  const {
    pieceOrder,
    moveCount,
    score,
    progress,
    solvedPieces,
    selectedAnchorIndex,
    showResults,
    setShowResults,
    isWin,
    isComplete,
    moveGroup,
    toggleSelection,
  } = useVitraisInfinitosEngine(entry, initialState);
  const imageUrl = useTDImageCardUrl(entry.cardId);
  const [boardWidth, containerRef] = useCardWidthByContainerRef(1, {
    margin: 72,
    gap: 0,
    maxWidth: 512,
    minWidth: 256,
  });

  if (!isDailyVitraisInfinitosEntry(data)) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-[2rem] bg-card px-5 py-6 text-center shadow-sm">
        <Title level={4}>Não deu para abrir o vitral de hoje</Title>
        <Text type="secondary">
          Os dados recebidos para Vitrais∞ não têm o formato esperado.
        </Text>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
    >
      <GameStatsRow>
        <GameStat
          icon={Check}
          value={`${solvedPieces}/${data.pieces.length}`}
          label="Peças corretas"
        />
        <GameStat
          icon={MoveHorizontal}
          value={moveCount}
          label="Movimentos"
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
        <Title level={3}>{data.title}</Title>
        <Text type="secondary">
          Reúna os pedaços que já combinam e deslize os blocos até revelar o
          vitral inteiro.
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

      <Text
        type="secondary"
        className="text-center"
      >
        Arraste um bloco conectado ou toque em uma peça para selecioná-la e
        depois tocar no destino.
      </Text>

      <PuzzleBoard
        pieceOrder={pieceOrder}
        width={boardWidth}
        imageUrl={imageUrl}
        isComplete={isComplete}
        selectedAnchorIndex={selectedAnchorIndex}
        onSelectAnchor={toggleSelection}
        onMoveGroup={moveGroup}
      />

      {isComplete && !showResults && (
        <div className="flex w-full flex-col items-center gap-3 rounded-[2rem] bg-gold-soft px-5 py-5 text-center shadow-sm">
          <Title level={4}>Vitral concluído!</Title>
          <Text type="secondary">
            Você já montou a imagem de hoje. Abra o resultado para rever o
            vitral completo.
          </Text>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowResults(true)}
          >
            Ver resultado
          </Button>
        </div>
      )}

      {isComplete && showResults && (
        <ResultsSplash
          title={data.title}
          solvedPieces={solvedPieces}
          pieceCount={data.pieces.length}
          moveCount={moveCount}
          score={score}
          imageUrl={imageUrl}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
