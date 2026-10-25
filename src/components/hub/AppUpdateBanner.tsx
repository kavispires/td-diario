import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';
import { useAppUpdateAvailable } from '@hooks/useAppUpdateAvailable';
import { hardRefresh } from '@utils/hardRefresh';
import { RefreshCw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Discreet, dismissible banner prompting the player to refresh once a newer
 * app version has been published (see {@link useAppUpdateAvailable}),
 * offering a one-tap hard refresh instead of relying on several manual
 * reloads to pick up the new deploy. Floats above the rest of the page,
 * vertically centered, over a solid (non-transparent) background so it
 * reads clearly regardless of what's behind it. Dismissible via its own
 * close button or by tapping refresh; reappears the next time the Hub
 * mounts if the client is still outdated.
 *
 * @returns The rendered update banner portal, or `null` while no update is
 *   available or the player already dismissed it this session.
 */
export function AppUpdateBanner() {
  const updateAvailable = useAppUpdateAvailable();
  const [dismissed, setDismissed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await hardRefresh();
  }

  return createPortal(
    <AnimatePresence>
      {updateAvailable && !dismissed && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-auto w-full max-w-md"
          >
            <Alert
              type="info"
              message="Nova versão do aplicativo está disponível"
              description={
                <Button
                  variant="primary"
                  size="small"
                  icon={<RefreshCw size={16} />}
                  loading={refreshing}
                  onClick={handleRefresh}
                  className="mt-2"
                  block
                >
                  Atualizar agora
                </Button>
              }
              closable
              onClose={() => setDismissed(true)}
              className="w-full bg-surface-raised shadow-2xl"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
