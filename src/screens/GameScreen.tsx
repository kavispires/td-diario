import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { ErrorScreen } from '@screens/states/ErrorScreen';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import type { ComponentType, LazyExoticComponent } from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { PlaceholderGameData } from '../types/puzzles';
import { SplashScreen } from './states/SplashScreen';

/**
 * A lazily-loaded game engine component, resolved on demand by game id.
 * Receives today's daily payload for that game once it has loaded.
 */
type GameComponent = LazyExoticComponent<
  ComponentType<{ data: PlaceholderGameData }>
>;

const gameComponents: Record<string, GameComponent> = {
  alienado: lazy(() =>
    import('@engines/games/Alienado').then(({ DailyAlienadoGame }) => ({
      default: DailyAlienadoGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  'arte-ruim': lazy(() =>
    import('@engines/games/ArteRuim').then(({ DailyArteRuimGame }) => ({
      default: DailyArteRuimGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  conjuntos: lazy(() =>
    import('@engines/games/Conjuntos').then(({ DailyConjuntosGame }) => ({
      default: DailyConjuntosGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  filmaco: lazy(() =>
    import('@engines/games/Filmaco').then(({ DailyFilmacoGame }) => ({
      default: DailyFilmacoGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  investigacao: lazy(() =>
    import('@engines/games/Investigacao').then(({ DailyInvestigacaoGame }) => ({
      default: DailyInvestigacaoGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  mapeamento: lazy(() =>
    import('@engines/games/Mapeamento').then(({ DailyMapeamentoGame }) => ({
      default: DailyMapeamentoGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  organiku: lazy(() =>
    import('@engines/games/Organiku').then(({ DailyOrganikuGame }) => ({
      default: DailyOrganikuGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  palavreado: lazy(() =>
    import('@engines/games/Palavreado').then(({ DailyPalavreadoGame }) => ({
      default: DailyPalavreadoGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  panico: lazy(() =>
    import('@engines/games/Panico').then(({ DailyPanicoGame }) => ({
      default: DailyPanicoGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  pirralhos: lazy(() =>
    import('@engines/games/Pirralhos').then(({ DailyPirralhosGame }) => ({
      default: DailyPirralhosGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  portais: lazy(() =>
    import('@engines/games/Portais').then(({ DailyPortaisGame }) => ({
      default: DailyPortaisGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  quartetos: lazy(() =>
    import('@engines/games/Quartetos').then(({ DailyQuartetosGame }) => ({
      default: DailyQuartetosGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  vitral: lazy(() =>
    import('@engines/games/Vitral').then(({ DailyVitralGame }) => ({
      default: DailyVitralGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  'aqui-o': lazy(() =>
    import('@engines/games/AquiO').then(({ DailyAquiOGame }) => ({
      default: DailyAquiOGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  estoquista: lazy(() =>
    import('@engines/special/Estoquista').then(({ DailyEstoquistaGame }) => ({
      default: DailyEstoquistaGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  'vitrais-infinitos': lazy(() =>
    import('@engines/special/VitraisInfinitos').then(
      ({ DailyVitraisInfinitosGame }) => ({
        default: DailyVitraisInfinitosGame as ComponentType<{
          data: PlaceholderGameData;
        }>,
      }),
    ),
  ),
  'ta-na-cara': lazy(() =>
    import('@engines/contributions/TaNaCara').then(({ DailyTaNaCaraGame }) => ({
      default: DailyTaNaCaraGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  conexoes: lazy(() =>
    import('@engines/contributions/Conexoes').then(({ DailyConexoesGame }) => ({
      default: DailyConexoesGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
  picaco: lazy(() =>
    import('@engines/contributions/Picaco').then(({ DailyPicacoGame }) => ({
      default: DailyPicacoGame as ComponentType<{
        data: PlaceholderGameData;
      }>,
    })),
  ),
};

/**
 * Resolves the `:gameId` route param to its lazy game engine component,
 * fetches today's daily payload for it, and renders the game with that
 * data. Falls back to an error screen for unknown ids or missing/failed
 * daily data, and a splash screen while either is loading.
 *
 * @returns The matched game's engine, an error/splash screen while data or
 *   the game chunk loads.
 */
export function GameScreen() {
  const { gameId } = useParams<{ gameId: string }>();
  const Game = gameId ? gameComponents[gameId] : undefined;
  const dailyChallenges = useGetDailyChallenges();

  if (!Game || !gameId) {
    return <ErrorScreen message="Não encontramos esse jogo." />;
  }

  if (dailyChallenges.isLoading) {
    return <SplashScreen />;
  }

  // `challenges`/`contributions` only declare known game ids as optional
  // fields (no string index signature), so a dynamic lookup by `gameId`
  // needs this cast; the underlying value is still `PlaceholderGameData`.
  const gamesById = dailyChallenges.data?.challenges as
    | Record<string, PlaceholderGameData | undefined>
    | undefined;
  const contributionsById = dailyChallenges.data?.contributions as
    | Record<string, PlaceholderGameData | undefined>
    | undefined;
  const data = gamesById?.[gameId] ?? contributionsById?.[gameId];

  if (dailyChallenges.isError || !data) {
    return (
      <ErrorScreen message="Não encontramos o desafio de hoje para esse jogo." />
    );
  }

  return (
    <Suspense fallback={<SplashScreen />}>
      <GameReadyNotifier
        gameId={gameId}
        number={typeof data.number === 'number' ? data.number : null}
      />
      <Game data={data} />
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
  /**
   * Today's daily-challenge number for this game, shown in the Header.
   */
  number: number | null;
};

/**
 * Flips the game launch splash from `loading` to `ready` once the lazy game
 * chunk has mounted, so the splash can offer Jogar/Regras instead of
 * disappearing immediately. Entering a game from elsewhere (not a direct
 * landing) is the only case with a `loading` splash to flip. Also publishes
 * today's challenge number to the Header for as long as this game is mounted.
 */
function GameReadyNotifier({ gameId, number }: GameReadyNotifierProps) {
  const launchingGame = useAppRuntimeStore((state) => state.launchingGame);
  const setLaunchingGame = useAppRuntimeStore(
    (state) => state.setLaunchingGame,
  );
  const setActiveGameNumber = useAppRuntimeStore(
    (state) => state.setActiveGameNumber,
  );

  useEffect(() => {
    if (launchingGame?.id === gameId && launchingGame.phase === 'loading') {
      setLaunchingGame({ id: gameId, phase: 'ready' });
    }
  }, [gameId, launchingGame, setLaunchingGame]);

  useEffect(() => {
    setActiveGameNumber(number);
    return () => setActiveGameNumber(null);
  }, [number, setActiveGameNumber]);

  return null;
}
