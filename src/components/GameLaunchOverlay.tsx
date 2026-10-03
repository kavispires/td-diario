import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { loadLocalToday } from '@hooks/useDailyLocalToday';
import { getCardState } from '@hooks/useGameProgress';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { GAME_LIFECYCLE_STATUS } from '@utils/constants';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import type { DefaultGameState, PlaceholderGameData } from 'types/puzzles';
import { GameLogos } from './hub/GameLogos';
import { DualTranslate } from './ui/DualTranslate';

/**
 * Labels for the primary action button, keyed by the launching game's
 * current card state (completed, in-progress, or not yet started).
 */
const PLAY_BUTTON_LABELS = {
  completed: 'Ver Resultado',
  'in-progress': 'Continuar',
  available: 'Jogar',
  disabled: 'Jogar',
} as const;

const LAYOUT_TRANSITION = {
  layout: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 20,
  },
  opacity: {
    duration: 0.25,
    ease: 'easeInOut' as const,
  },
};

/**
 * Persistent fullscreen splash that shares `layoutId`s with the originating GameCard
 * and the Header's logo slot. Expands on game entry and shows a loading state while
 * the game chunk/data is fetched; once ready, it offers the primary action (Jogar,
 * Continuar, or Ver Resultado, depending on today's locally-persisted progress for
 * that game, which enters the game and clears the splash so the logo's `layoutId`
 * carries it into the Header), Regras (opens the rules screen without dismissing the
 * splash), and Voltar (dismisses the splash and navigates back to the hub).
 */
export function GameLaunchOverlay() {
  const launchingGame = useAppRuntimeStore((state) => state.launchingGame);
  const setLaunchingGame = useAppRuntimeStore(
    (state) => state.setLaunchingGame,
  );
  const setActiveGameId = useAppRuntimeStore((state) => state.setActiveGameId);
  const openRules = useAppRuntimeStore((state) => state.openRules);
  const navigate = useNavigate();

  const gameInfo = launchingGame
    ? gameInfos[launchingGame.id as keyof typeof gameInfos]
    : undefined;

  const dailyChallenges = useGetDailyChallenges();
  // `challenges`/`contributions` only declare known game ids as optional
  // fields (no string index signature), so a dynamic lookup by id needs
  // this cast; the underlying value is still `PlaceholderGameData`.
  const gamesById = dailyChallenges.data?.challenges as
    | Record<string, PlaceholderGameData | undefined>
    | undefined;
  const contributionsById = dailyChallenges.data?.contributions as
    | Record<string, PlaceholderGameData | undefined>
    | undefined;
  const challenge = launchingGame
    ? (gamesById?.[launchingGame.id] ?? contributionsById?.[launchingGame.id])
    : undefined;

  const cardState =
    gameInfo && challenge
      ? getCardState(
          gameInfo.release,
          loadLocalToday<DefaultGameState>({
            key: gameInfo.key,
            dateId: challenge.id,
            defaultValue: {
              id: challenge.id,
              status: GAME_LIFECYCLE_STATUS.IDLE,
              progress: 0,
              score: 0,
            },
          }).status,
        )
      : undefined;
  const playLabel = PLAY_BUTTON_LABELS[cardState ?? 'available'];

  function handlePlay() {
    if (!launchingGame) {
      return;
    }
    setActiveGameId(launchingGame.id);
    setLaunchingGame(null);
  }

  function handleRules() {
    if (!launchingGame) {
      return;
    }
    openRules(launchingGame.id);
  }

  function handleClose() {
    setLaunchingGame(null);
    navigate('/');
  }

  return (
    <AnimatePresence>
      {launchingGame && gameInfo && (
        <motion.div
          key="game-launch-splash"
          layoutId={`game-card-${launchingGame.id}`}
          transition={LAYOUT_TRANSITION}
          exit={{ opacity: 0 }}
          style={{ backgroundColor: gameInfo.color }}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-4"
        >
          <motion.div
            layoutId={`game-logo-${launchingGame.id}`}
            transition={LAYOUT_TRANSITION}
            className="w-24 h-24 flex items-center justify-center"
          >
            <GameLogos
              gameId={launchingGame.id}
              className="w-full h-full drop-shadow-sm"
            />
          </motion.div>

          <div className="flex flex-col items-center gap-2">
            <Title
              level={2}
              className="text-foreground text-center"
            >
              <DualTranslate>{gameInfo.name}</DualTranslate>
            </Title>

            <Text strong>
              <DualTranslate>{gameInfo.tagline}</DualTranslate>
            </Text>

            {launchingGame.phase === 'loading' ? (
              /* Placeholder loading indicator until a dedicated one is built */
              <Text
                className="animate-pulse text-muted-foreground"
                role="status"
                strong
              >
                Carregando...
              </Text>
            ) : (
              <div className="flex w-full max-w-xs flex-col gap-3 px-6 pt-2">
                <Button
                  variant="chrome"
                  block
                  onClick={handlePlay}
                >
                  {playLabel}
                </Button>
                <Button
                  variant="outlined"
                  block
                  className="border-white text-white hover:bg-white/10"
                  onClick={handleRules}
                >
                  Regras
                </Button>
                <Button
                  variant="ghost"
                  block
                  className="text-white hover:bg-white/10"
                  onClick={handleClose}
                >
                  Voltar
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
