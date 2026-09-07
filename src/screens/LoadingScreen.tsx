import { TDLogoIcon } from '@components/TDLogoIcon';
import { Text } from '@components/ui/Typography';

type LoadingScreenProps = {
  message?: string;
};

export function LoadingScreen({
  message = 'Carregando...',
}: LoadingScreenProps) {
  return (
    <main
      className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 overflow-hidden text-sm text-slate-900"
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
