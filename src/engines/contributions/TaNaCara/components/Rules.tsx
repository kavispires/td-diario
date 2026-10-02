import { Text } from '@components/ui/Typography';

/**
 * Renders Ta Na Cara's rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Contribua com o banco de depoimentos do TD Diário.</Text>
      </li>
      <li>
        <Text>
          Em cada rodada, você verá um depoimento e 6 personagens para julgar só
          pela cara.
        </Text>
      </li>
      <li>
        <Text>
          Marque quem combina com a frase usando Sim ou Não. Se estiver na
          dúvida, deixe em branco.
        </Text>
      </li>
      <li>
        <Text>É preciso avaliar pelo menos 4 pessoas por depoimento.</Text>
      </li>
      <li>
        <Text>
          Depois de 6 depoimentos, você já pode salvar sua contribuição — ou
          continuar respondendo mais alguns.
        </Text>
      </li>
    </ul>
  );
}
