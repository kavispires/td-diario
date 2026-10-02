import { Text } from '@components/ui/Typography';
import { Heart } from 'lucide-react';

/**
 * Renders Portais' rules, shown inside the shared `RulesOverlay`.
 */
export function Rules() {
  return (
    <ul className="list-disc space-y-3 pl-5 text-foreground">
      <li>
        <Text>Você está diante de portais com imagens fantásticas.</Text>
      </li>
      <li>
        <Text>
          Organize as palavras verticalmente para formar a palavra-chave que
          conecta cada corredor.
        </Text>
      </li>
      <li>
        <Text>
          Quando uma letra está certa, ela se trava em dourado até você acertar
          a palavra inteira.
        </Text>
      </li>
      <li>
        <Text>Você precisa atravessar três corredores de portais.</Text>
      </li>
      <li>
        <Text>
          Cada tentativa errada remove um{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />
          .
        </Text>
      </li>
      <li>
        <Text>
          Você tem 4{' '}
          <Heart
            className="inline h-4 w-4 fill-destructive text-destructive"
            aria-hidden="true"
          />{' '}
          tentativas para encontrar todas as palavras-chave. Boa sorte!
        </Text>
      </li>
    </ul>
  );
}
