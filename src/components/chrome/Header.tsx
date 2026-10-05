import { GameLogos } from '@components/hub/GameLogos';
import { DualTranslate } from '@components/ui/DualTranslate';
import { IconButton } from '@components/ui/IconButton';
import { Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';
import { isDevEnv } from '@utils/helpers';
import {
  Bell,
  BookOpen,
  ChevronLeft,
  CodeXml,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TDLogoIcon } from '../TDLogoIcon';
import { GameSecretMenu } from './GameSecretMenu';

/**
 * Number of consecutive taps on the game number required to reveal the
 * {@link GameSecretMenu}.
 */
const SECRET_MENU_TAP_THRESHOLD = 5;

/**
 * Maximum gap, in milliseconds, allowed between taps for them to still
 * count as "consecutive" toward the secret menu threshold.
 */
const SECRET_MENU_TAP_WINDOW_MS = 1500;

/**
 * Renders the app's sticky top header, showing the current game's logo and
 * title (or the app brand on the hub) plus sound control and, depending on
 * context, either notifications (hub) or a rules trigger (in-game). Tapping
 * the game number several times in a row reveals a hidden maintenance menu
 * (see {@link GameSecretMenu}).
 *
 * @returns The sticky header element.
 */
export function ChromeHeader() {
  const activeGameId = useAppRuntimeStore((state) => state.activeGameId);
  const activeGameNumber = useAppRuntimeStore(
    (state) => state.activeGameNumber,
  );
  const openRules = useAppRuntimeStore((state) => state.openRules);
  const soundEnabled = useUserPreferencesStore((state) => state.soundEnabled);
  const setSoundEnabled = useUserPreferencesStore(
    (state) => state.setSoundEnabled,
  );
  const navigate = useNavigate();

  const [secretMenuOpen, setSecretMenuOpen] = useState(false);
  const tapCountRef = useRef(0);
  const tapResetTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const activeGameInfo = activeGameId
    ? gameInfos[activeGameId as keyof typeof gameInfos]
    : undefined;
  const headerTitle = activeGameInfo ? (
    <DualTranslate>{activeGameInfo.name}</DualTranslate>
  ) : (
    'TD Diário'
  );

  /**
   * Counts consecutive taps on the game number, opening the secret menu
   * once the threshold is reached within the allowed time window.
   */
  function handleNumberTap() {
    if (tapResetTimeoutRef.current) {
      clearTimeout(tapResetTimeoutRef.current);
    }

    tapCountRef.current += 1;
    if (tapCountRef.current >= SECRET_MENU_TAP_THRESHOLD) {
      tapCountRef.current = 0;
      setSecretMenuOpen(true);
      return;
    }

    tapResetTimeoutRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, SECRET_MENU_TAP_WINDOW_MS);
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-chrome text-slate-50 shadow-md">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {activeGameId && (
              <IconButton
                icon={<ChevronLeft />}
                aria-label="Voltar para o hub"
                size="small"
                className="w-6 h-6 p-0 -ml-1"
                onClick={() => navigate('/')}
              />
            )}
            {activeGameId ? (
              <motion.button
                type="button"
                layoutId={`game-logo-${activeGameId}`}
                transition={{
                  layout: {
                    type: 'spring',
                    stiffness: 180,
                    damping: 20,
                  },
                }}
                className="w-6 h-6 shrink-0"
                aria-label="Voltar para o hub"
                onClick={() => navigate('/')}
              >
                <GameLogos
                  gameId={activeGameId}
                  className="w-full h-full"
                />
              </motion.button>
            ) : (
              <TDLogoIcon className="w-6 h-6 shrink-0" />
            )}
          </div>
          <Title
            level={1}
            className="text-xl text-slate-50"
          >
            {headerTitle}
            {activeGameId && activeGameNumber != null && (
              <button
                type="button"
                className="ml-1 text-base text-slate-50/70"
                onClick={handleNumberTap}
              >
                #{activeGameNumber}
              </button>
            )}
          </Title>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-2">
          {isDevEnv && (
            <IconButton
              icon={<CodeXml />}
              aria-label="Componentes de UI (dev)"
              onClick={() => navigate('/dev/showcase')}
            />
          )}
          {activeGameId ? (
            <IconButton
              icon={<BookOpen />}
              aria-label="Ver regras"
              onClick={() => openRules(activeGameId)}
            />
          ) : (
            <IconButton
              icon={<Bell />}
              aria-label="Notificações"
              dot
            />
          )}
          <IconButton
            icon={soundEnabled ? <Volume2 /> : <VolumeX />}
            aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
            onClick={() => setSoundEnabled(!soundEnabled)}
          />
        </div>
      </div>
      {activeGameInfo && (
        <GameSecretMenu
          open={secretMenuOpen}
          onClose={() => setSecretMenuOpen(false)}
          gameInfo={activeGameInfo}
        />
      )}
    </header>
  );
}
