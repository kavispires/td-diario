import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { MAPEAMENTO_HEARTS } from '../utils/helpers';

/**
 * Renders Mapeamento's rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Descubra a localização certa a partir das pistas do dia.</Text>
      </li>
      <li>
        <Text>
          Você começa com uma pista liberada e ganha mais uma sempre que errar.
        </Text>
      </li>
      <li>
        <Text>
          Cada tentativa errada custa um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          .
        </Text>
      </li>
      <li>
        <Text>
          As letras reveladas no fragmento precisam aparecer nas próximas
          tentativas.
        </Text>
      </li>
      <li>
        <Text>
          O nome pode ser de país, cidade, ponto turístico ou até lugar
          fictício.
        </Text>
      </li>
      <li>
        <Text>
          Você tem {MAPEAMENTO_HEARTS}{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          no total. Boa sorte!
        </Text>
      </li>
    </ul>
  );
}
