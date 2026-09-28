import { Modal } from '@components/ui/Modal';
import { Text } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { rulesComponents } from '@engines/rulesComponents';
import { useDualTranslate } from '@hooks/useDualTranslate';
import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { withAlpha } from '@utils/helpers';
import { Suspense } from 'react';

/**
 * Persistent rules screen: a fullscreen backdrop tinted with the game's
 * color, hosting a Modal with the game's rules content. Can be triggered
 * from the game launch splash's Regras button or the in-game Header's
 * Regras button, and sits above the launch splash so it never dismisses it.
 */
export function RulesOverlay() {
  const rulesGameId = useAppRuntimeStore((state) => state.rulesGameId);
  const closeRules = useAppRuntimeStore((state) => state.closeRules);
  const translate = useDualTranslate();

  const gameInfo = rulesGameId
    ? gameInfos[rulesGameId as keyof typeof gameInfos]
    : undefined;
  const RulesContent = rulesGameId ? rulesComponents[rulesGameId] : undefined;

  if (!rulesGameId || !gameInfo || !RulesContent) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[105]"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.95) }}
    >
      <Modal
        open
        onClose={closeRules}
        title={`Regras — ${translate(gameInfo.name)}`}
        zIndex={110}
      >
        <Suspense
          fallback={
            <Text className="animate-pulse text-muted-foreground">
              Carregando regras...
            </Text>
          }
        >
          <RulesContent />
        </Suspense>
      </Modal>
    </div>
  );
}
