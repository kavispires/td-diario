import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { getPieceStyle } from '../utils/puzzleUtils';

/**
 * How long, in seconds, the outgoing artwork layer takes to fade out and
 * reveal the new one underneath.
 */
const FADE_DURATION_SECONDS = 3;

/**
 * Props accepted by the {@link PieceArtwork} component.
 */
type PieceArtworkProps = {
  /**
   * Id of the rendered piece, used to crop the correct region of the artwork.
   */
  pieceId: number;
  /**
   * Full source image URL for the puzzle artwork.
   */
  imageUrl: string;
  /**
   * Total row count in today's puzzle.
   */
  totalRows: number;
};

/**
 * Renders one piece's cropped artwork, cross-fading into a new image over
 * ~3 seconds whenever `imageUrl` changes (e.g. a "mirage" Vitral cycling
 * through its extra source images) instead of swapping abruptly.
 *
 * The new image is always rendered underneath at full opacity; the outgoing
 * image is layered on top and animated out with Motion, which drives the
 * fade imperatively (not via a raw CSS transition), so it reliably animates
 * regardless of render/paint timing.
 *
 * @param props Piece identity and the artwork to crop/display.
 * @returns The rendered, cross-fading piece artwork layer(s).
 */
export function PieceArtwork({
  pieceId,
  imageUrl,
  totalRows,
}: PieceArtworkProps) {
  const previousImageUrlRef = useRef(imageUrl);
  const [fadingFromUrl, setFadingFromUrl] = useState<string | null>(null);

  // Adjusting state during render (guarded by the ref comparison) captures
  // the outgoing image the moment `imageUrl` changes, before this frame is
  // ever painted.
  if (imageUrl !== previousImageUrlRef.current) {
    setFadingFromUrl(previousImageUrlRef.current);
    previousImageUrlRef.current = imageUrl;
  }

  return (
    <>
      <div style={getPieceStyle(pieceId, imageUrl, totalRows)} />
      {fadingFromUrl && (
        <motion.div
          key={fadingFromUrl}
          style={getPieceStyle(pieceId, fadingFromUrl, totalRows)}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: FADE_DURATION_SECONDS, ease: 'linear' }}
          onAnimationComplete={() => setFadingFromUrl(null)}
        />
      )}
    </>
  );
}
