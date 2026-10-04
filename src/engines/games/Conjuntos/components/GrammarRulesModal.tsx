import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Paragraph, Text } from '@components/ui/Typography';
import { CircleHelp } from 'lucide-react';
import { useState } from 'react';

/**
 * One grammar-rule category shown inside the {@link GrammarRulesModal},
 * naming the kind of rule and giving example hints for it.
 */
type RuleCategory = {
  /**
   * Display name of the grammar-rule category.
   */
  category: string;
  /**
   * Example hints describing what rules in this category look for.
   */
  hints: string[];
};

const RULE_CATEGORIES: RuleCategory[] = [
  {
    category: 'Comparação',
    hints: ['Quantidade de vogais vs consoantes ou posição'],
  },
  {
    category: 'Contagem',
    hints: [
      'Contém um número específico de letras, vogais, consoantes, ou sílabas',
    ],
  },
  {
    category: 'Gramática',
    hints: ['Sílaba tônica, origem, gênero'],
  },
  {
    category: 'Inclusão',
    hints: ['Contém uma ou mais letras específicas'],
  },
  {
    category: 'Inicialização',
    hints: ['Começa com uma letra (ou letras) específica'],
  },
  {
    category: 'Repetição',
    hints: ['Contém letras repetidas ou repetidas de maneira específica'],
  },
  {
    category: 'Sequência',
    hints: ['Contém uma sequência de letras específica'],
  },
  {
    category: 'Terminação',
    hints: ['Termina com uma letra (ou letras) específica'],
  },
];

/**
 * Renders the "Entenda as regras gramaticais" button and the modal it
 * opens, listing every grammar-rule category the daily puzzle's hidden
 * rules can draw from.
 *
 * @returns The trigger button plus its grammar-rules modal.
 */
export function GrammarRulesModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        size="small"
        icon={<CircleHelp />}
        onClick={() => setOpen(true)}
      >
        Entenda as regras gramaticais
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Regras gramaticais"
      >
        <Paragraph>
          O título do jogo diário contém dicas sobre as regras gramaticais
          secretas dos círculos em forma de categorias.
          <br />
          As estrelas são a classificação do nível de dificuldade das regras
          (1-5).
        </Paragraph>

        <div className="space-y-3">
          {RULE_CATEGORIES.map(({ category, hints }) => (
            <Paragraph
              key={category}
              className="mb-0"
            >
              <Text strong>{category}: </Text>
              {hints.join(', ')}.
            </Paragraph>
          ))}
        </div>
      </Modal>
    </>
  );
}
