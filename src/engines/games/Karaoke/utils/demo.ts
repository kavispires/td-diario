import type { PlaceholderGameData } from 'types/puzzles';

/**
 * Builds a locally-generated Karaoke challenge, used while the
 * backend doesn't yet serve this game's daily payload (demo release
 * stage). The sample is fixed and date-independent, since it's only ever
 * shown as a placeholder while the real daily challenge isn't available.
 *
 * @returns A fixed demo `PlaceholderGameData`.
 */
export function getKaraokeDemo(): PlaceholderGameData {
  return {
    id: '2026-10-04',
    number: 1,
    type: 'karaoke',
  };
}
