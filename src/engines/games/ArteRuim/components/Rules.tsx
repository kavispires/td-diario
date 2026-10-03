import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { ARTE_RUIM_HEARTS } from '../utils/constants';

/**
 * Renders Arte Ruim's rules, shown inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Observe os desenhos e tente descobrir a expressão secreta.</Text>
      </li>
      <li>
        <Text>
          Você precisa escolher as letras uma por uma até revelar toda a
          resposta.
        </Text>
      </li>
      <li>
        <Text>
          Cada letra errada custa um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          .
        </Text>
      </li>
      <li>
        <Text>
          Você tem {ARTE_RUIM_HEARTS}{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          chances no total.
        </Text>
      </li>
      <li>
        <Text>
          Letras corretas revelam todas as ocorrências daquela letra de uma só
          vez e ainda rendem pontos.
        </Text>
      </li>
    </ul>
  );
}
