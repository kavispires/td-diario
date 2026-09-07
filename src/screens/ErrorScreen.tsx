import { TDLogoIcon } from '@components/TDLogoIcon';
import { Button } from '@components/ui/Button';
import { Paragraph, Text, Title } from '@components/ui/Typography';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type ErrorScreenProps = {
  /**
   * Additional context shown below the default error message.
   */
  message?: string;
  /**
   * Action used to retry the failed operation.
   */
  onRetry?: () => void;
};

export function ErrorScreen({
  message = 'Não conseguimos carregar esta página agora.',
  onRetry = () => window.location.reload(),
}: ErrorScreenProps) {
  return (
    <main
      className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-5 py-10 text-slate-900"
      role="alert"
      aria-live="assertive"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#f8d8cf]/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#d5ece8]/70 blur-3xl" />

      <section className="relative z-10 flex w-full max-w-md flex-col items-center rounded-[2rem] border border-white/70 bg-[#fffaf7]/90 px-6 py-9 text-center shadow-[0_20px_60px_rgba(64,59,70,0.14)] backdrop-blur-sm sm:px-10">
        <TDLogoIcon
          static
          className="mb-6 h-20 w-20 object-contain sm:h-24 sm:w-24"
        />

        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8d8cf] text-[#d67878]">
          <AlertTriangle
            size={28}
            strokeWidth={2.25}
            aria-hidden="true"
          />
        </div>

        <Text
          type="secondary"
          strong
          className="mb-2 text-xs uppercase tracking-[0.2em]"
        >
          Ops, algo deu errado
        </Text>
        <Title
          level={1}
          className="max-w-sm text-2xl sm:text-3xl"
        >
          Voltamos já já
        </Title>
        <Paragraph className="mb-7 mt-3 max-w-sm text-center text-[#746d79]">
          {message} Tente novamente — seus desafios estão esperando por você.
        </Paragraph>

        <Button
          icon={
            <RefreshCw
              size={18}
              aria-hidden="true"
            />
          }
          onClick={onRetry}
          className="w-full max-w-xs bg-[#8f7fb8] shadow-md hover:bg-[#7c6aa6]"
        >
          Tentar novamente
        </Button>

        <Text
          type="secondary"
          className="mt-5 text-xs"
        >
          Se o problema continuar, volte em alguns instantes.
        </Text>
      </section>
    </main>
  );
}
