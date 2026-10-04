import type { GameInfo } from '../../../types/puzzles';

export const gameInfo: GameInfo = {
  id: 'epocas',
  key: 'EPOCAS',
  type: 'game',
  color: 'rgb(181, 136, 99)',
  emoji: '🕰️',
  name: { pt: 'Épocas', en: 'Eras' },
  tagline: {
    pt: 'Na minha, era tudo diferente!',
    en: 'In my time, everything was different!',
  },
  releaseDate: '2026-10-04',
  release: 'soon',
  version: '0.0.1',
};

/**
 * Placeholder logo shown on the hub while Épocas is still being built.
 */
export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      {...props}
    >
      <title>Épocas Logo</title>
      <circle
        cx="256"
        cy="256"
        r="240"
        fill="rgb(181, 136, 99)"
      />
    </svg>
  );
}
