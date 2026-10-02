import { Text } from '@components/ui/Typography';

/**
 * Renders Picaco's rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Contribua com o banco de desenhos do TD Diário.</Text>
      </li>
      <li>
        <Text>
          Você receberá 6 expressões e terá 10 segundos para desenhar cada uma.
        </Text>
      </li>
      <li>
        <Text>Vale só desenho: não use letras nem números.</Text>
      </li>
      <li>
        <Text>
          Quando o tempo acabar, o jogo avança automaticamente para a próxima
          expressão.
        </Text>
      </li>
      <li>
        <Text>
          Capriche nos detalhes, evite conteúdo impróprio e tente deixar cada
          traço o mais claro possível.
        </Text>
      </li>
    </ul>
  );
}
