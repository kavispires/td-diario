import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import {
  HEART_LOSS_INTERVAL_SECONDS,
  VITRAL_TOTAL_HEARTS,
} from '../utils/puzzleUtils';

/**
 * Renders Vitral's rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Monte o vitral quebra-cabeça o mais rápido que puder.</Text>
      </li>
      <li>
        <Text>
          Arraste uma peça até uma posição onde ela combine com outra já
          encostada. Quando encaixarem, elas passam a se mover juntas.
        </Text>
      </li>
      <li>
        <Text>
          Cada nova conexão rende pontos de acordo com a quantidade de{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          restantes.
        </Text>
      </li>
      <li>
        <Text>
          Você começa com {VITRAL_TOTAL_HEARTS}{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          e perde um a cada {HEART_LOSS_INTERVAL_SECONDS} segundos, mais um
          segundo extra por peça do quebra-cabeça.
        </Text>
      </li>
      <li>
        <Text>
          Se montar tudo a tempo, o vitral fica dourado e a rodada termina com
          vitória.
        </Text>
      </li>
    </ul>
  );
}
