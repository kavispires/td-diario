import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import {
  QUARTETOS_GROUP_SIZE,
  QUARTETOS_QUARTETS_PER_PUZZLE,
} from '../utils/constants';

/**
 * Renders Quartetos' rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          As coisas na grade foram secretamente agrupadas em quartetos com temas
          em comum.
        </Text>
      </li>
      <li>
        <Text>
          Forme um grupo de {QUARTETOS_GROUP_SIZE} itens relacionados e clique
          em <strong>Enviar</strong>.
        </Text>
      </li>
      <li>
        <Text>
          Tente descobrir os {QUARTETOS_QUARTETS_PER_PUZZLE} quartetos, um por
          um.
        </Text>
      </li>
      <li>
        <Text>
          Cada tentativa errada remove um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          .
        </Text>
      </li>
      <li>
        <Text>
          Você começa com {QUARTETOS_QUARTETS_PER_PUZZLE}{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          porque o desafio sempre esconde {QUARTETOS_QUARTETS_PER_PUZZLE}{' '}
          grupos. Boa sorte!
        </Text>
      </li>
    </ul>
  );
}
