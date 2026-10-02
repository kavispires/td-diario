import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { PIRRALHOS_TOTAL_HEARTS } from '../utils/constants';

/**
 * Renders Pirralhos' rules, shown inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Descubra qual criança pegou o brinquedo.</Text>
      </li>
      <li>
        <Text>
          Crianças estão lado a lado quando há uma seta entre elas no círculo.
        </Text>
      </li>
      <li>
        <Text>
          Pode haver mentirosos entre elas, e a quantidade pode ser exata ou um
          a menos do que a pista informar.
        </Text>
      </li>
      <li>
        <Text>
          A criança culpada nem sempre mente. Às vezes o pirralho se entrega por
          arrependimento.
        </Text>
      </li>
      <li>
        <Text>
          Você pode marcar cada criança como culpada, mentirosa, inocente ou
          deixar sem marca enquanto organiza seus palpites.
        </Text>
      </li>
      <li>
        <Text>
          Você tem {PIRRALHOS_TOTAL_HEARTS}{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          chances. Acertou, venceu. Errou todas, acabou.
        </Text>
      </li>
    </ul>
  );
}
