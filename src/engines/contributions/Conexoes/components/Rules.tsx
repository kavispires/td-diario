import { Text } from '@components/ui/Typography';
import { MIN_REQUIRED_PAIRS } from '../utils/constants';

/**
 * Renders Conexões' rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Contribua com o banco de imagens relacionadas do TD Diário.</Text>
      </li>
      <li>
        <Text>
          Em cada rodada, você verá duas imagens e decidirá se elas têm alguma
          relação.
        </Text>
      </li>
      <li>
        <Text>
          Vale qualquer conexão que faça sentido para você: cor, forma, tema,
          objeto, clima ou até uma associação mais criativa.
        </Text>
      </li>
      <li>
        <Text>
          Deslize o par para a direita ou toque em <strong>Sim</strong> quando
          as imagens combinarem.
        </Text>
      </li>
      <li>
        <Text>
          Deslize para a esquerda ou toque em <strong>Não</strong> quando não
          houver relação.
        </Text>
      </li>
      <li>
        <Text>
          É preciso avaliar pelo menos {MIN_REQUIRED_PAIRS} pares antes de
          encerrar.
        </Text>
      </li>
    </ul>
  );
}
