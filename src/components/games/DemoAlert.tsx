import { Alert } from '@components/ui/Alert';

/**
 * Warns the player that the current game is still a demo (`release ===
 * 'demo'`) and that their results here don't count toward their permanent
 * stats. Rendered automatically by `GameScreen` above every demo game, so
 * no individual engine needs to wire this in itself.
 */
export function DemoAlert() {
  return (
    <Alert
      type="info"
      message="Isto é uma versão de teste."
      description="Esse jogo ainda está em testes — seu progresso aqui não é salvo nas suas estatísticas."
      className="mx-auto w-full max-w-md px-4 pt-4"
    />
  );
}
