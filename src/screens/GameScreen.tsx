import { ErrorScreen } from '@screens/ErrorScreen';
import { LoadingScreen } from '@screens/LoadingScreen';
import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

type GameComponent = LazyExoticComponent<ComponentType>;

const gameComponents: Record<string, GameComponent> = {
  alienado: lazy(() =>
    import('@engines/games/Alienado').then(({ DailyAlienadoGame }) => ({
      default: DailyAlienadoGame,
    })),
  ),
  'arte-ruim': lazy(() =>
    import('@engines/games/ArteRuim').then(({ DailyArteRuimGame }) => ({
      default: DailyArteRuimGame,
    })),
  ),
  conjuntos: lazy(() =>
    import('@engines/games/Conjuntos').then(({ DailyConjuntosGame }) => ({
      default: DailyConjuntosGame,
    })),
  ),
  filmaco: lazy(() =>
    import('@engines/games/Filmaco').then(({ DailyFilmacoGame }) => ({
      default: DailyFilmacoGame,
    })),
  ),
  investigacao: lazy(() =>
    import('@engines/games/Investigacao').then(({ DailyInvestigacaoGame }) => ({
      default: DailyInvestigacaoGame,
    })),
  ),
  mapeamento: lazy(() =>
    import('@engines/games/Mapeamento').then(({ DailyMapeamentoGame }) => ({
      default: DailyMapeamentoGame,
    })),
  ),
  organiku: lazy(() =>
    import('@engines/games/Organiku').then(({ DailyOrganikuGame }) => ({
      default: DailyOrganikuGame,
    })),
  ),
  palavreado: lazy(() =>
    import('@engines/games/Palavreado').then(({ DailyPalavreadoGame }) => ({
      default: DailyPalavreadoGame,
    })),
  ),
  panico: lazy(() =>
    import('@engines/games/Panico').then(({ DailyPanicoGame }) => ({
      default: DailyPanicoGame,
    })),
  ),
  pirralhos: lazy(() =>
    import('@engines/games/Pirralhos').then(({ DailyPirralhosGame }) => ({
      default: DailyPirralhosGame,
    })),
  ),
  portais: lazy(() =>
    import('@engines/games/Portais').then(({ DailyPortaisGame }) => ({
      default: DailyPortaisGame,
    })),
  ),
  quartetos: lazy(() =>
    import('@engines/games/Quartetos').then(({ DailyQuartetosGame }) => ({
      default: DailyQuartetosGame,
    })),
  ),
  vitral: lazy(() =>
    import('@engines/games/Vitral').then(({ DailyVitralGame }) => ({
      default: DailyVitralGame,
    })),
  ),
  'aqui-o': lazy(() =>
    import('@engines/special/AquiO').then(({ DailyAquiOGame }) => ({
      default: DailyAquiOGame,
    })),
  ),
  estoquista: lazy(() =>
    import('@engines/special/Estoquista').then(({ DailyEstoquistaGame }) => ({
      default: DailyEstoquistaGame,
    })),
  ),
  'vitrais-infinitos': lazy(() =>
    import('@engines/special/VitraisInfinitos').then(
      ({ DailyVitraisInfinitosGame }) => ({
        default: DailyVitraisInfinitosGame,
      }),
    ),
  ),
  'ta-na-cara': lazy(() =>
    import('@engines/contributions/TaNaCara').then(({ DailyTaNaCaraGame }) => ({
      default: DailyTaNaCaraGame,
    })),
  ),
  picaco: lazy(() =>
    import('@engines/contributions/Picaco').then(({ DailyPicacoGame }) => ({
      default: DailyPicacoGame,
    })),
  ),
};

export function GameScreen() {
  const { gameId } = useParams<{ gameId: string }>();
  const Game = gameId ? gameComponents[gameId] : undefined;

  if (!Game) {
    return <ErrorScreen message="Não encontramos esse jogo." />;
  }

  return (
    <Suspense fallback={<LoadingScreen message="Carregando jogo..." />}>
      <Game />
    </Suspense>
  );
}
