import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';

/**
 * Renders Palavreado's rules inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>
          A palavra-chave aparece na diagonal e as palavras do desafio ficam
          embaralhadas nas linhas.
        </Text>
      </li>
      <li>
        <Text>
          Toque em uma letra e depois em outra para trocar as duas de lugar.
        </Text>
      </li>
      <li>
        <Text>
          Quando achar que a grade está pronta, aperte <strong>Enviar</strong>.
        </Text>
      </li>
      <li>
        <Text>
          Letras posicionadas corretamente ficam travadas com a cor da linha, e
          completar uma palavra inteira rende pontos extras.
        </Text>
      </li>
      <li>
        <Text>
          Se você formar alguma palavra bônus da lista secreta, também ganha
          pontos mesmo que ela não seja a resposta daquela linha.
        </Text>
      </li>
      <li>
        <Text>
          Cada envio errado custa um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          . Você pode usar o Embaralhar inteligente uma única vez, depois da
          primeira tentativa e antes da última.
        </Text>
      </li>
      <li>
        <Text>Boa sorte — e divirta-se reorganizando as palavras.</Text>
      </li>
    </ul>
  );
}
