import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { PANICO_TOTAL_HEARTS } from '../utils/helpers';

/**
 * Renders Panico's rules for the shared rules overlay.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Complete a sequência de botões.</Text>
      </li>
      <li>
        <Text>
          Siga a instrução do botão atual e memorize as regras que ele mandar
          guardar para os próximos.
        </Text>
      </li>
      <li>
        <Text>
          Aperte a quantidade exata quando a instrução pedir um número.
        </Text>
      </li>
      <li>
        <Text>
          Palavras-chave como “sempre” e “nunca” valem para os botões seguintes.
          “Sempre” ganha de “nunca”.
        </Text>
      </li>
      <li>
        <Text>
          Quando você erra, perde um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          e recomeça do início, mas a sequência continua a mesma.
        </Text>
      </li>
      <li>
        <Text>
          Você começa com {PANICO_TOTAL_HEARTS}{' '}
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
