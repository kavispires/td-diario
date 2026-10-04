import type { GameInfo } from '../../../types/puzzles';

export const gameInfo: GameInfo = {
  id: 'colorido',
  key: 'COLORIDO',
  type: 'game',
  color: 'rgb(230, 126, 169)',
  emoji: '🎨',
  name: { pt: 'Colorido', en: 'Colorful' },
  tagline: {
    pt: 'Um jogo de cores que em breve estará disponível!',
    en: 'A color-guessing game coming soon!',
  },
  releaseDate: '2026-10-04',
  release: 'soon',
  version: '0.0.1',
};

/**
 * Placeholder logo shown on the hub while Colorido is still being built.
 */
export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <title>Colorido Logo</title>
      <circle
        cx="256"
        cy="256"
        r="240"
        fill="rgb(230, 126, 169)"
      />
    </svg>
  );
}
