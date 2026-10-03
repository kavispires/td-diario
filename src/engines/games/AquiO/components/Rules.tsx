import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';
import { GOAL, HEARTS, ROUND_DURATION_SECONDS } from '../utils/constants';

/**
 * Renders Aqui O's rules, shown inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          Você recebe dois discos cheios de itens. Só existe um item em comum
          entre eles.
        </Text>
      </li>
      <li>
        <Text>
          Toque nesse item o mais rápido possível. Cada acerto leva você para o
          próximo par de discos.
        </Text>
      </li>
      <li>
        <Text>
          Você tem {ROUND_DURATION_SECONDS} segundos para encontrar {GOAL}{' '}
          pares. Nos fins de semana, os discos ganham um nono item para bagunçar
          ainda mais a busca.
        </Text>
      </li>
      <li>
        <Text>
          Cada erro custa um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          . Acabaram os {HEARTS}? A rodada de hoje termina ali mesmo.
        </Text>
      </li>
      <li>
        <Text>
          No modo difícil, o mesmo item não pode ser a resposta em duas duplas
          seguidas.
        </Text>
      </li>
    </ul>
  );
}
