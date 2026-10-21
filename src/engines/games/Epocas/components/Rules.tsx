import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { EPOCAS_TOTAL_HEARTS } from '../utils/constants';

/**
 * Renders Épocas' rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          Cada evento histórico esconde um ano secreto. Arraste (ou toque em
          dois eventos) para reordená-los em uma linha do tempo.
        </Text>
      </li>
      <li>
        <Text>
          Quando achar que a ordem está correta, clique em{' '}
          <strong>Verificar</strong>.
        </Text>
      </li>
      <li>
        <Text>
          Se todos os eventos estiverem na ordem cronológica certa, você vence!
        </Text>
      </li>
      <li>
        <Text>
          Caso contrário, você só descobre quantos eventos estavam na posição
          certa (não quais), perde um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          e pode ajustar a ordem para tentar de novo.
        </Text>
      </li>
      <li>
        <Text>
          Você começa com {EPOCAS_TOTAL_HEARTS}{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          . Boa sorte!
        </Text>
      </li>
    </ul>
  );
}
