import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { FILMACO_HEARTS } from '../utils/helpers';

/**
 * Renders Filmaco's rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          Descubra o filme secreto observando os ícones e o ano exibidos no
          topo.
        </Text>
      </li>
      <li>
        <Text>
          Os ícones não estão em ordem e podem apontar tanto para palavras do
          título quanto para elementos marcantes da história.
        </Text>
      </li>
      <li>
        <Text>
          Toque nas letras e números do teclado até completar o nome do filme.
        </Text>
      </li>
      <li>
        <Text>
          Cada palpite errado custa um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          .
        </Text>
      </li>
      <li>
        <Text>
          Você tem {FILMACO_HEARTS}{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          no total. Boa sessão!
        </Text>
      </li>
    </ul>
  );
}
