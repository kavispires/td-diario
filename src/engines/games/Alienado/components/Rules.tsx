import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import {
  ALIENADO_ATTRIBUTE_HINT_GROUPS,
  ALIENADO_REQUEST_COUNT,
} from '../utils/constants';

/**
 * Renders Alienado's rules, shown inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <div className="space-y-4 text-foreground">
      <ul className="list-disc space-y-3 pl-5">
        <li>
          <Text>
            {`O alienígena precisa de ajuda para abduzir ${ALIENADO_REQUEST_COUNT} coisas, mas só se comunica com símbolos.`}
          </Text>
        </li>
        <li>
          <Text>
            Cada símbolo representa um atributo em comum entre os exemplos
            mostrados no dicionário alienígena.
          </Text>
        </li>
        <li>
          <Text>
            {`Monte as ${ALIENADO_REQUEST_COUNT} entregas na ordem certa e envie tudo de uma vez. O alienígena só diz se a combinação inteira está certa ou errada.`}
          </Text>
        </li>
        <li>
          <Text>
            Cada erro consome um{' '}
            <Heart
              className="inline h-4 w-4 fill-destructive text-destructive"
              aria-hidden="true"
            />
            . Você começa com um coração para cada pedido.
          </Text>
        </li>
        <li>
          <Text>
            Toque em uma posição para focá-la, escolha um item disponível e
            toque no item encaixado para removê-lo.
          </Text>
        </li>
      </ul>

      <div className="space-y-3 rounded-3xl bg-surface-raised p-4">
        <Text strong>Dicas de interpretação</Text>

        <div className="space-y-3">
          {ALIENADO_ATTRIBUTE_HINT_GROUPS.map((group) => (
            <div
              key={group.title}
              className="space-y-1"
            >
              <Text strong>{group.title}</Text>
              <Text
                type="secondary"
                className="block text-sm"
              >
                {group.hints.join(', ')}.
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
