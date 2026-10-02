import { Text } from '@components/ui/Typography';
import { AudioLines, Grid2x2, Heart, Search } from 'lucide-react';

/**
 * Renders Investigação's rules, shown inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          Você é o detetive do caso e precisa deixar só o culpado sem ser
          liberado.
        </Text>
      </li>
      <li>
        <Text>
          Comece pelas pistas já abertas e revele uma nova declaração principal
          a cada dois inocentes liberados.
        </Text>
      </li>
      <li>
        <Text>
          As pistas podem falar sobre a aparência do suspeito{' '}
          <Search
            className="inline h-4 w-4"
            aria-hidden="true"
          />
          , sua posição na grade{' '}
          <Grid2x2
            className="inline h-4 w-4"
            aria-hidden="true"
          />
          , ou rumores sobre sua personalidade{' '}
          <AudioLines
            className="inline h-4 w-4"
            aria-hidden="true"
          />
          .
        </Text>
      </li>
      <li>
        <Text>
          Você pode gastar até três{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          para revelar dicas extras.
        </Text>
      </li>
      <li>
        <Text>
          Atenção: se você liberar o culpado, perde na hora. Boa sorte!
        </Text>
      </li>
    </ul>
  );
}
