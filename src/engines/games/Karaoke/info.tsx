import type { GameInfo } from '../../../types/puzzles';

export const gameInfo: GameInfo = {
  id: 'karaoke',
  key: 'KARAOKE',
  type: 'game',
  color: 'rgb(147, 112, 219)',
  emoji: '🎵',
  name: { pt: 'Karaokê', en: 'Karaoke' },
  tagline: {
    pt: 'Qual é a música?',
    en: 'A music game coming soon!',
  },
  releaseDate: '2026-10-04',
  release: 'soon',
  version: '0.0.1',
};

/**
 * Placeholder logo shown on the hub while Karaoke is still being built.
 */
export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <title>Karaoke Logo</title>
      <circle
        cx="256"
        cy="256"
        r="240"
        fill="rgb(147, 112, 219)"
      />
    </svg>
  );
}
