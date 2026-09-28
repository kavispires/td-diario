import { TDLogoIcon } from '@components/TDLogoIcon';
import { Text } from '@components/ui/Typography';

/**
 * Props accepted by the {@link LoadingScreen} component.
 */
type LoadingScreenProps = {
  /**
   * Text shown below the logo while loading. Defaults to `Carregando...`.
   */
  message?: string;
};

/**
 * Renders a full-screen loading state with the app logo and a status
 * message, shown while data or a route is being fetched.
 *
 * @param props Optional custom loading message.
 * @returns The loading screen element.
 */
export function LoadingScreen({
  message = 'Carregando...',
}: LoadingScreenProps) {
  return (
    <main
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 overflow-hidden text-sm text-foreground"
      aria-busy="true"
      aria-live="polite"
    >
      <TDLogoIcon className="h-32 w-32 object-contain sm:h-40 sm:w-40" />
      <Text
        className="animate-pulse"
        role="status"
        strong
      >
        {message}
      </Text>
    </main>
  );
}
