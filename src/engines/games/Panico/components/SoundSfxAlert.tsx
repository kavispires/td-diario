import { Alert } from '@components/ui/Alert';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';

/**
 * Reminds the player that Panico works best with sound enabled.
 */
export function SoundSfxAlert() {
  const soundEnabled = useUserPreferencesStore((state) => state.soundEnabled);

  if (soundEnabled) {
    return null;
  }

  return (
    <Alert
      type="warning"
      message="Este jogo fica melhor com o som ligado."
      description="Use o botão de som no topo da tela para ativá-lo antes de começar."
      className="w-full"
    />
  );
}
