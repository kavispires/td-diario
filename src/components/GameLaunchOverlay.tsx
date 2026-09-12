import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { AnimatePresence, motion } from 'motion/react';
import { GameLogos } from './hub/GameLogos';

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
 * and the Header's logo slot. Expands on game entry; once the game is ready the splash
 * is cleared, so its background fades out while the logo's `layoutId` carries it into the Header.
 */
export function GameLaunchOverlay() {
  const launchingGame = useAppRuntimeStore((state) => state.launchingGame);
  const language = useAppRuntimeStore((state) => state.language);

  const gameInfo = launchingGame
    ? gameInfos[launchingGame.id as keyof typeof gameInfos]
    : undefined;

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
              className="text-slate-900 text-center"
            >
              {gameInfo.name[language] || gameInfo.name.pt}
            </Title>
            {/* Placeholder loading indicator until a dedicated one is built */}
            <Text
              className="animate-pulse text-slate-800"
              role="status"
              strong
            >
              Carregando...
            </Text>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
