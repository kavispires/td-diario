import { GameLogos } from '@components/hub/GameLogos';
import { IconButton } from '@components/ui/IconButton';
import { Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { isDevEnv } from '@utils/helpers';
import { Bell, LayoutGrid, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
// import { VolumeX } from 'lucide-react'; // Use this when sound is off
import { useNavigate } from 'react-router-dom';
import { TDLogoIcon } from '../TDLogoIcon';

/**
 * Renders the app's sticky top header, showing the current game's logo and
 * title (or the app brand on the hub) plus notification and sound controls.
 *
 * @returns The sticky header element.
 */
export function ChromeHeader() {
  const activeGameId = useAppRuntimeStore((state) => state.activeGameId);
  const language = useAppRuntimeStore((state) => state.language);
  const navigate = useNavigate();

  const activeGameInfo = activeGameId
    ? gameInfos[activeGameId as keyof typeof gameInfos]
    : undefined;
  const headerTitle = activeGameInfo
    ? activeGameInfo.name[language] || activeGameInfo.name.pt
    : 'TD Diário';

  return (
    <header className="sticky top-0 z-50 w-full bg-chrome text-slate-50 shadow-md">
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
        <div className="flex items-center gap-2">
          {isDevEnv && (
            <IconButton
              icon={<LayoutGrid />}
              aria-label="Componentes de UI (dev)"
              onClick={() => navigate('/dev/showcase')}
            />
          )}
          <IconButton
            icon={<Bell />}
            aria-label="Notificações"
            dot
          />
          <IconButton
            icon={<Volume2 />}
            aria-label="Alternar som"
          />
        </div>
      </div>
    </header>
  );
}
