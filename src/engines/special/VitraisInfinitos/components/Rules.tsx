import { Text } from '@components/ui/Typography';

/**
 * Renders Vitrais Infinitos's rules, shown inside the shared
 * `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Monte o vitral arrastando as peças para os lugares certos.</Text>
      </li>
      <li>
        <Text>
          Quando duas peças já encostam como deveriam na imagem final, elas
          formam um bloco e passam a se mover juntas.
        </Text>
      </li>
      <li>
        <Text>
          Vale tanto arrastar um bloco inteiro quanto tocar em uma peça para
          selecioná-la e depois tocar no destino.
        </Text>
      </li>
      <li>
        <Text>
          Sua pontuação cresce conforme mais peças entram no lugar certo.
        </Text>
      </li>
      <li>
        <Text>Complete todas as peças e admire o vitral do dia.</Text>
      </li>
    </ul>
  );
}
