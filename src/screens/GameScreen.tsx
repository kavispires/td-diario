import { ErrorScreen } from '@screens/states/ErrorScreen';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SplashScreen } from './states/SplashScreen';

/**
 * A lazily-loaded game engine component, resolved on demand by game id.
 */
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

/**
 * Resolves the `:gameId` route param to its lazy game engine component and
 * renders it, falling back to an error screen for unknown ids.
 *
 * @returns The matched game's engine, an error screen, or a splash screen
 *   while the game chunk loads.
 */
export function GameScreen() {
  const { gameId } = useParams<{ gameId: string }>();
  const Game = gameId ? gameComponents[gameId] : undefined;

  if (!Game || !gameId) {
    return <ErrorScreen message="Não encontramos esse jogo." />;
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <GameReadyNotifier gameId={gameId} />
      <Game />
    </Suspense>
  );
}

/**
 * Props accepted by the {@link GameReadyNotifier} component.
 */
type GameReadyNotifierProps = {
  /**
   * Id of the game engine that just mounted.
   */
  gameId: string;
};

/**
 * Flips the game launch splash from `loading` to `ready` once the lazy game
 * chunk has mounted, so the splash can offer Jogar/Regras instead of
 * disappearing immediately. Entering a game from elsewhere (not a direct
 * landing) is the only case with a `loading` splash to flip.
 */
function GameReadyNotifier({ gameId }: GameReadyNotifierProps) {
  const launchingGame = useAppRuntimeStore((state) => state.launchingGame);
  const setLaunchingGame = useAppRuntimeStore(
    (state) => state.setLaunchingGame,
  );

  useEffect(() => {
    if (launchingGame?.id === gameId && launchingGame.phase === 'loading') {
      setLaunchingGame({ id: gameId, phase: 'ready' });
    }
  }, [gameId, launchingGame, setLaunchingGame]);

  return null;
}
