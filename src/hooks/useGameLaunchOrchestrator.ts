import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const GAME_ROUTE_PATTERN = /^\/game\/([^/]+)/;

/**
 * Drives the fullscreen splash shared-element transition by watching route changes.
 * Entering a `/game/:id` route from elsewhere expands the clicked GameCard into the splash.
 * Leaving a `/game/:id` route goes straight back to the Hub with no reverse animation.
 * Landing directly on a game route (e.g. the `ongoingGame` auto-redirect) skips the animation entirely.
 */
export function useGameLaunchOrchestrator() {
  const location = useLocation();
  const setLaunchingGame = useAppRuntimeStore(
    (state) => state.setLaunchingGame,
  );
  const setActiveGameId = useAppRuntimeStore((state) => state.setActiveGameId);
  const previousPathname = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const previous = previousPathname.current;
    const current = location.pathname;
    const currentGameMatch = current.match(GAME_ROUTE_PATTERN);
    const previousGameMatch = previous?.match(GAME_ROUTE_PATTERN);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Landed directly on a game route (e.g. the ongoingGame redirect): no card to animate from.
      if (currentGameMatch) {
        setActiveGameId(currentGameMatch[1]);
      }
    } else if (currentGameMatch && !previousGameMatch) {
      setLaunchingGame({ id: currentGameMatch[1] });
    } else if (!currentGameMatch && previousGameMatch) {
      setActiveGameId(null);
    }

    previousPathname.current = current;
  }, [location.pathname, setLaunchingGame, setActiveGameId]);
}
