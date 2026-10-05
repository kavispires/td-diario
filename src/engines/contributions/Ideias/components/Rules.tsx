import { Text } from '@components/ui/Typography';

/**
 * Renders Ideias' rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Contribua com ideias para os conteúdos do TD Diário.</Text>
      </li>
      <li>
        <Text>
          Escolha para qual jogo você quer sugerir algo, ou mande uma ideia ou
          feedback geral.
        </Text>
      </li>
      <li>
        <Text>Preencha o formulário da categoria escolhida e envie.</Text>
      </li>
      <li>
        <Text>
          Para Investigação, evite perguntas diretamente sobre aparência física.
        </Text>
      </li>
      <li>
        <Text>Você pode enviar quantas ideias quiser por dia.</Text>
      </li>
    </ul>
  );
}
