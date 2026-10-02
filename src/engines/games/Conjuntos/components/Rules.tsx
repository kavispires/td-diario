import { Text } from '@components/ui/Typography';
import { Heart, Star } from 'lucide-react';

/**
 * Renders Conjuntos' rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          Há dois círculos conectados com uma interseção. Cada círculo segue uma
          regra gramatical secreta.
        </Text>
      </li>
      <li>
        <Text>
          A coisa que já começa no meio obedece às duas regras. As coisas que já
          aparecem nas laterais obedecem só ao círculo correspondente.
        </Text>
      </li>
      <li>
        <Text>
          Escolha uma coisa da sua mão e coloque na área certa do diagrama.
        </Text>
      </li>
      <li>
        <Text>
          Se errar, a coisa vai para o lugar correto mesmo assim, você perde um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          e uma nova coisa entra na sua mão.
        </Text>
      </li>
      <li>
        <Text>
          Cada acerto vale <strong>10 pontos por coração restante</strong>.
        </Text>
      </li>
      <li>
        <Text>
          O título do dia já dá uma pista sobre a categoria da regra. As{' '}
          <Star
            className="inline h-4 w-4 fill-gold text-gold"
            aria-hidden="true"
          />{' '}
          indicam o nível de dificuldade.
        </Text>
      </li>
      <li>
        <Text>
          Você começa com 4{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          durante a semana e 5 aos fins de semana. Perca todos e o jogo acaba.
        </Text>
      </li>
    </ul>
  );
}
