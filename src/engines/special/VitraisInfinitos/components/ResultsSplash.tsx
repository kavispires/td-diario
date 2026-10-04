import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Surface } from '@components/ui/Surface';
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
      <div className="flex w-full max-w-xs flex-col gap-2 text-center">
        <Text strong>Você montou o vitral de hoje:</Text>
        <Text strong>"{title}"</Text>
      </div>

      <Hearts
        remaining={solvedPieces}
        total={pieceCount}
        emptyClassName="text-black"
      />

      <Surface className="w-full overflow-hidden bg-black/20 p-2">
        <img
          src={imageUrl}
          alt={`Prévia completa do vitral "${title}"`}
          className="h-auto w-full rounded-[1.5rem] object-cover"
        />
      </Surface>

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {solvedPieces} de {pieceCount} peças montadas em {moveCount}{' '}
          movimentos
        </Text>
        <Divider orientation="vertical" />
        <Score
          value={score}
          className="text-black"
        />
      </div>
    </GameResultsSplash>
  );
}
