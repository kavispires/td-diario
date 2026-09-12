import { GameLogos } from '@components/hub/GameLogos';
import { Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { Bell, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
// import { VolumeX } from 'lucide-react'; // Use this when sound is off
import { TDLogoIcon } from '../TDLogoIcon';

export function ChromeHeader() {
  const activeGameId = useAppRuntimeStore((state) => state.activeGameId);
  const language = useAppRuntimeStore((state) => state.language);

  const activeGameInfo = activeGameId
    ? gameInfos[activeGameId as keyof typeof gameInfos]
    : undefined;
  const headerTitle = activeGameInfo
    ? activeGameInfo.name[language] || activeGameInfo.name.pt
    : 'TD Diário';

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-slate-50 shadow-md">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          {activeGameId ? (
            <motion.div
              layoutId={`game-logo-${activeGameId}`}
              transition={{
                layout: {
                  type: 'spring',
                  stiffness: 180,
                  damping: 20,
                },
              }}
              className="w-6 h-6 shrink-0"
            >
              <GameLogos
                gameId={activeGameId}
                className="w-full h-full"
              />
            </motion.div>
          ) : (
            <TDLogoIcon className="w-6 h-6 shrink-0" />
          )}
          <Title
            level={1}
            className="text-xl text-slate-50"
          >
            {headerTitle}
          </Title>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-4">
          {/* Notification Bell with unread dot */}
          <button
            type="button"
            className="relative p-1 active:scale-90 transition-transform"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className="p-1 active:scale-90 transition-transform"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
