import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';

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
          Forme um grupo de quatro itens relacionados e clique em{' '}
          <strong>Enviar</strong>.
        </Text>
      </li>
      <li>
        <Text>Tente descobrir os quatro quartetos, um por um.</Text>
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
          Você começa com quatro{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          porque o desafio sempre esconde quatro grupos. Boa sorte!
        </Text>
      </li>
    </ul>
  );
}
