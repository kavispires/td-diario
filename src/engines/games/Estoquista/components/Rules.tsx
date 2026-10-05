import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import {
  ESTOQUISTA_RULES_IN_STOCK_ORDERS_COUNT,
  ESTOQUISTA_RULES_STARTING_HEARTS,
} from '../utils/constants';

const ESTOQUISTA_RULES_GOODS_COUNT = 16;
const ESTOQUISTA_RULES_ORDERS_COUNT = 4;

/**
 * Renders Estoquista's rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          {`Primeiro, organize os ${ESTOQUISTA_RULES_GOODS_COUNT} produtos nas prateleiras vazias do jeito que fizer mais sentido para a sua memória.`}
        </Text>
      </li>
      <li>
        <Text>
          {`Depois disso, os itens somem de vista e chegam ${ESTOQUISTA_RULES_ORDERS_COUNT} pedidos. Só ${ESTOQUISTA_RULES_IN_STOCK_ORDERS_COUNT} deles estão realmente no estoque.`}
        </Text>
      </li>
      <li>
        <Text>
          Posicione cada pedido na prateleira certa e mande para{' '}
          <strong>Fora de estoque</strong> o item que não aparece em nenhuma
          delas.
        </Text>
      </li>
      <li>
        <Text>
          Cada envio errado custa um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          , e recomeçar a arrumação também consome um.
        </Text>
      </li>
      <li>
        <Text>
          {`Você começa com ${ESTOQUISTA_RULES_STARTING_HEARTS} `}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          e vence quando despacha todos os pedidos corretamente.
        </Text>
      </li>
    </ul>
  );
}
