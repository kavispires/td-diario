import { GameStat, GameStatsRow } from '@components/games/GameStats';
import { SeeResultsButton } from '@components/games/SeeResultsButton';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { useTDImageCardUrl } from '@hooks/useTDImageCardUrl';
import { Check, Coins, MoveHorizontal } from 'lucide-react';
import type { DailyVitraisInfinitosEntry } from 'types/games';
import { gameInfo } from '../info';
import {
  BOARD_CONTAINER_COLUMNS,
  BOARD_CONTAINER_GAP,
  BOARD_CONTAINER_MARGIN,
  BOARD_MAX_WIDTH,
  BOARD_MIN_WIDTH,
} from '../utils/constants';
import type { GameState } from '../utils/types';
import { useVitraisInfinitosEngine } from '../utils/useVitraisInfinitosEngine';
import { PuzzleBoard } from './PuzzleBoard';
import { ResultsSplash } from './ResultsSplash';

/**
 * Props accepted by the {@link VitraisInfinitosGame} component.
 */
export type VitraisInfinitosGameProps = {
  /**
   * Today's Vitrais Infinitos payload, as resolved by `GameScreen`.
   */
  data: DailyVitraisInfinitosEntry;
  /**
   * Restored or freshly built state used to seed today's puzzle engine.
   */
  initialState: GameState;
};

/**
 * Renders a full day of Vitrais Infinitos: the draggable stained-glass
 * puzzle, its progress stats, and a fullscreen results splash once the
 * image is fully reconstructed.
 *
 * @param props Today's Vitrais Infinitos payload and initial engine state.
 * @returns The rendered Vitrais Infinitos game.
 */
export function VitraisInfinitosGame({
  data,
  initialState,
}: VitraisInfinitosGameProps) {
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
  } = useVitraisInfinitosEngine(data, initialState);
  const imageUrl = useTDImageCardUrl(data.cardId);
  const [boardWidth, containerRef] = useCardWidthByContainerRef(
    BOARD_CONTAINER_COLUMNS,
    {
      margin: BOARD_CONTAINER_MARGIN,
      gap: BOARD_CONTAINER_GAP,
      maxWidth: BOARD_MAX_WIDTH,
      minWidth: BOARD_MIN_WIDTH,
    },
  );

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8"
    >
      <GameStatsRow
        progress={isWin ? 1 : progress}
        color={gameInfo.color}
      >
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
        <Surface className="flex w-full flex-col items-center gap-3 bg-gold-soft px-5 py-5 text-center">
          <Title level={4}>Vitral concluído!</Title>
          <Text type="secondary">
            Você já montou a imagem de hoje. Abra o resultado para rever o
            vitral completo.
          </Text>
          <SeeResultsButton
            isComplete={isComplete}
            setShowResults={setShowResults}
          />
        </Surface>
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
