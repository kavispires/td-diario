import { Logo as PicacoLogo } from '@engines/contributions/Picaco/info';
import { Logo as TaNaCaraLogo } from '@engines/contributions/TaNaCara/info';
import { Logo as AlienadoLogo } from '@engines/games/Alienado/info';
import { Logo as ArteRuimLogo } from '@engines/games/ArteRuim/info';
import { Logo as ConjuntosLogo } from '@engines/games/Conjuntos/info';
import { Logo as FilmacoLogo } from '@engines/games/Filmaco/info';
import { Logo as InvestigacaoLogo } from '@engines/games/Investigacao/info';
import { Logo as MapeamentoLogo } from '@engines/games/Mapeamento/info';
import { Logo as OrganikuLogo } from '@engines/games/Organiku/info';
import { Logo as PalavreadoLogo } from '@engines/games/Palavreado/info';
import { Logo as PanicoLogo } from '@engines/games/Panico/info';
import { Logo as PirralhosLogo } from '@engines/games/Pirralhos/info';
import { Logo as PortaisLogo } from '@engines/games/Portais/info';
import { Logo as QuartetosLogo } from '@engines/games/Quartetos/info';
import { Logo as VitralLogo } from '@engines/games/Vitral/info';
import { Logo as AquiOLogo } from '@engines/special/AquiO/info';
import { Logo as EstoquistaLogo } from '@engines/special/Estoquista/info';
import { Logo as VitraisInfinitosLogo } from '@engines/special/VitraisInfinitos/info';
import type { SVGProps } from 'react';

type GameLogosProps = SVGProps<SVGSVGElement> & {
  gameId: string;
};

/**
 * Renders the logo associated with a game identifier.
 */
export function GameLogos({ gameId, ...props }: GameLogosProps) {
  switch (gameId) {
    case 'alienado':
      return <AlienadoLogo {...props} />;
    case 'arte-ruim':
      return <ArteRuimLogo {...props} />;
    case 'conjuntos':
      return <ConjuntosLogo {...props} />;
    case 'filmaco':
      return <FilmacoLogo {...props} />;
    case 'investigacao':
      return <InvestigacaoLogo {...props} />;
    case 'mapeamento':
      return <MapeamentoLogo {...props} />;
    case 'organiku':
      return <OrganikuLogo {...props} />;
    case 'palavreado':
      return <PalavreadoLogo {...props} />;
    case 'panico':
      return <PanicoLogo {...props} />;
    case 'pirralhos':
      return <PirralhosLogo {...props} />;
    case 'portais':
      return <PortaisLogo {...props} />;
    case 'quartetos':
      return <QuartetosLogo {...props} />;
    case 'vitral':
      return <VitralLogo {...props} />;
    case 'aqui-o':
      return <AquiOLogo {...props} />;
    case 'estoquista':
      return <EstoquistaLogo {...props} />;
    case 'vitrais-infinitos':
      return <VitraisInfinitosLogo {...props} />;
    case 'ta-na-cara':
      return <TaNaCaraLogo {...props} />;
    case 'picaco':
      return <PicacoLogo {...props} />;
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="512"
          height="512"
          viewBox="0 0 512 512"
        >
          <title>Default Logo</title>
          <path
            fill="#d4f2f6"
            d="M352.6 504.5H159.4a42.4 42.4 0 0 1-42.4-42.4V49.9a42.4 42.4 0 0 1 42.4-42.4h193.2A42.4 42.4 0 0 1 395 49.9v412.2a42.4 42.4 0 0 1-42.4 42.4"
          />
          <path
            fill="#a6e7f0"
            d="M352.6 7.5h-30A42.4 42.4 0 0 1 365 49.9v412.2a42.4 42.4 0 0 1-42.4 42.4h30a42.4 42.4 0 0 0 42.4-42.4V49.9a42.4 42.4 0 0 0-42.4-42.4"
          />
          <path
            fill="#678d98"
            d="M305.43 37.5h-98.86c-6.94 0-13.88-5.11-15.59-11.72l-4.7-18.28h139.44l-4.7 18.28c-1.7 6.6-8.65 11.72-15.6 11.72"
          />
          <path
            fill="#537983"
            d="m295.72 7.5-4.7 18.28c-1.7 6.6-8.65 11.72-15.59 11.72h30c6.94 0 13.89-5.11 15.59-11.72l4.7-18.28z"
          />
          <path
            fill="#678d98"
            d="M295 478h-78a19 19 0 0 1 0-38h78a19 19 0 0 1 0 38"
          />
          <path
            fill="#537983"
            d="M295 440h-30a19 19 0 0 1 0 38h30a19 19 0 0 0 0-38"
          />
          <circle
            cx="186.28"
            cy="359.78"
            r="30"
            fill="#ffd15b"
          />
          <path
            fill="#ffc344"
            d="M186.28 329.78a30 30 0 0 0-15 4.02 29.98 29.98 0 0 1 0 51.96 30 30 0 1 0 15-55.98"
          />
          <circle
            cx="319.19"
            cy="286"
            r="30"
            fill="#2ed1e2"
          />
          <path
            fill="#02c7dd"
            d="M319.19 256a30 30 0 0 0-15 4.02 29.98 29.98 0 0 1 0 51.96 30 30 0 1 0 15-55.98"
          />
          <circle
            cx="208.05"
            cy="215.03"
            r="30"
            fill="#fe646f"
          />
          <path
            fill="#fd4755"
            d="M208.05 185.04a30 30 0 0 0-15 4.02 29.98 29.98 0 0 1 0 51.95 30 30 0 1 0 15-55.98"
          />
          <circle
            cx="284"
            cy="113.55"
            r="30"
            fill="#fe7d43"
          />
          <path
            fill="#fd6930"
            d="M284 83.55a30 30 0 0 0-15 4.02 29.98 29.98 0 0 1 0 51.95 30 30 0 1 0 15-55.98"
          />
          <path d="M395 411.27a7.5 7.5 0 0 0-7.5 7.5v43.33a34.94 34.94 0 0 1-34.9 34.9H159.4a34.94 34.94 0 0 1-34.9-34.9v-358c-.34-9.93-14.66-9.92-15 0v358a49.96 49.96 0 0 0 49.9 49.9h193.2a49.96 49.96 0 0 0 49.9-49.9v-43.33a7.5 7.5 0 0 0-7.5-7.5M352.6 0H159.4a49.96 49.96 0 0 0-49.9 49.9v18.61c.34 9.93 14.66 9.92 15 0v-18.6A34.94 34.94 0 0 1 159.4 15h21.07l3.25 12.65C186.27 37.54 196.1 45 206.57 45h98.86c10.48 0 20.3-7.46 22.85-17.35L331.53 15h21.07a34.94 34.94 0 0 1 34.9 34.9V384c.35 9.93 14.66 9.92 15 0V49.9A49.96 49.96 0 0 0 352.6 0m-38.85 23.9c-.83 3.25-4.72 6.1-8.32 6.1h-98.86c-3.6 0-7.49-2.85-8.32-6.1l-2.3-8.9h120.1z" />
          <path d="M295 470.5h-34.85c-9.93.34-9.92 14.66 0 15H295c35.17-1.46 35.14-51.55 0-53h-78c-35.16 1.46-35.14 51.55 0 53h7.3c9.94-.34 9.93-14.66 0-15H217c-15.26-.63-15.25-22.37 0-23h78c15.26.63 15.25 22.37 0 23M186.28 322.28c-49.75 2.06-49.73 72.95 0 75 25.27.47 44.08-26.1 35.44-49.73l68.42-37.87c22.04 27.04 66.39 11.64 66.55-23.68.06-33.63-41.52-50.1-64.46-26.03l-49-31.96c4.86-12.38 1.8-28.04-6.91-37.58l32.57-42.58c24.2 11.08 52.95-7.6 52.6-34.3a37.54 37.54 0 0 0-37.5-37.5c-32.7-.1-49.65 39.67-27.34 63.11l-32.23 42.14c-24.27-12.23-54.23 6.44-53.87 33.73.08 33.94 41.8 50.19 64.76 25.72l48.86 31.86a37.6 37.6 0 0 0-1 23.79l-69.09 38.24a37.4 37.4 0 0 0-27.8-12.36M284 91.05c12.4 0 22.5 10.09 22.5 22.5-1.24 29.84-43.77 29.84-45 0 0-12.41 10.1-22.5 22.5-22.5m-75.95 146.49c-12.4 0-22.5-10.1-22.5-22.5 1.24-29.85 43.77-29.85 45 0 0 12.4-10.1 22.5-22.5 22.5m111.14 25.96c12.4 0 22.5 10.1 22.5 22.5-1.24 29.85-43.77 29.84-45 0 0-12.4 10.1-22.5 22.5-22.5m-132.9 118.78a22.53 22.53 0 0 1-22.5-22.5c1.23-29.85 43.76-29.84 45 0 0 12.4-10.1 22.5-22.5 22.5" />
        </svg>
      );
  }
}
