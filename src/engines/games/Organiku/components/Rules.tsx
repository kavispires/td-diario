import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { ORGANIKU_HEARTS } from '../utils/helpers';

/**
 * Renders Organiku's rules, shown inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Encontre os pares de coisas na grade.</Text>
      </li>
      <li>
        <Text>
          Você seleciona um espaço e deve selecionar outro espaço que você acha
          que é o par.
        </Text>
      </li>
      <li>
        <Text>
          Um item <strong>não</strong> pode aparecer mais de uma vez em uma
          mesma linha e coluna.
        </Text>
      </li>
      <li>
        <Text>
          Quando você não acerta o par, você perde um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          .
        </Text>
      </li>
      <li>
        <Text>
          Você tem {ORGANIKU_HEARTS}{' '}
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
