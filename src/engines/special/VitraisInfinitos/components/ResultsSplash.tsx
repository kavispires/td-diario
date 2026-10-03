import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text } from '@components/ui/Typography';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Title describing today's stained-glass image.
   */
  title: string;
  /**
   * Amount of pieces correctly placed when the puzzle finished.
   */
  solvedPieces: number;
  /**
   * Total amount of pieces in today's puzzle.
   */
  pieceCount: number;
  /**
   * Number of board rearrangements made before finishing.
   */
  moveCount: number;
  /**
   * Score accumulated from correct placements.
   */
  score: number;
  /**
   * Full image URL used to preview the completed stained glass.
   */
  imageUrl: string;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen results splash shown once Vitrais Infinitos is solved: recaps
 * the finished image, move count, and score, then lets the player either
 * return to the Hub or close the overlay.
 *
 * @param props Result data and the close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  title,
  solvedPieces,
  pieceCount,
  moveCount,
  score,
  imageUrl,
  onClose,
}: ResultsSplashProps) {
  return (
    <GameResultsSplash
      gameId="vitrais-infinitos"
      title="Vitral montado!"
      onClose={onClose}
    >
      <Text
        strong
        className="text-center"
      >
        {title}
      </Text>

      <div className="w-full overflow-hidden rounded-[2rem] bg-black/20 p-2 shadow-sm">
        <img
          src={imageUrl}
          alt={`Prévia completa do vitral "${title}"`}
          className="h-auto w-full rounded-[1.5rem] object-cover"
        />
      </div>

      <div className="grid w-full grid-cols-3 gap-3 rounded-[2rem] bg-white/70 px-4 py-4 text-center shadow-sm">
        <div className="flex flex-col gap-1">
          <Text
            strong
            className="text-lg"
          >
            {solvedPieces}/{pieceCount}
          </Text>
          <Text
            type="secondary"
            className="text-xs"
          >
            Peças certas
          </Text>
        </div>

        <div className="flex flex-col gap-1">
          <Text
            strong
            className="text-lg"
          >
            {moveCount}
          </Text>
          <Text
            type="secondary"
            className="text-xs"
          >
            Movimentos
          </Text>
        </div>

        <div className="flex flex-col gap-1">
          <Text
            strong
            className="text-lg"
          >
            {score}
          </Text>
          <Text
            type="secondary"
            className="text-xs"
          >
            Pontos
          </Text>
        </div>
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        As peças conectadas ficaram juntas até o fim. Agora é só admirar o
        vitral de hoje.
      </Text>
    </GameResultsSplash>
  );
}
