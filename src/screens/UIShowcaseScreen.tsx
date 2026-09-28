import { Alert } from '@components/ui/Alert';
import { Button } from '@components/ui/Button';
import { Divider } from '@components/ui/Divider';
import { Flex } from '@components/ui/Flex';
import { IconButton } from '@components/ui/IconButton';
import { Modal } from '@components/ui/Modal';
import { Pill } from '@components/ui/Pill';
import { Popover } from '@components/ui/Popover';
import { TextInput } from '@components/ui/TextInput';
import { Tooltip } from '@components/ui/Tooltip';
import { Paragraph, Text, Title } from '@components/ui/Typography';
import { Bell, Flame, Heart, Info } from 'lucide-react';
import { useState } from 'react';

/**
 * Dev-only showcase of every component in the shared `components/ui` kit,
 * used to manually test each component in isolation. Linked from the
 * header when running in a development environment.
 *
 * @returns The UI showcase screen element.
 */
export function UIShowcaseScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [warningVisible, setWarningVisible] = useState(true);

  return (
    <div className="flex flex-col gap-6 p-4">
      <Title level={2}>Componentes de UI</Title>

      <section className="flex flex-col gap-3">
        <Text strong>Button</Text>
        <Flex
          wrap
          gap="small"
        >
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="chrome">Chrome</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outlined">Outlined</Button>
          <Button
            variant="primary"
            icon={<Heart size={18} />}
          >
            Com ícone
          </Button>
          <Button
            variant="primary"
            loading
          >
            Carregando
          </Button>
        </Flex>
        <Flex
          wrap
          gap="small"
          align="center"
        >
          <Button
            variant="primary"
            size="small"
          >
            Small
          </Button>
          <Button
            variant="primary"
            size="default"
          >
            Default
          </Button>
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>IconButton</Text>
        <Flex gap="small">
          <IconButton
            icon={<Bell />}
            aria-label="Notificações"
            dot
          />
          <IconButton
            icon={<Heart />}
            aria-label="Favoritar"
            variant="secondary"
          />
          <IconButton
            icon={<Info />}
            aria-label="Informações"
            variant="outlined"
            shape="square"
          />
        </Flex>
      </section>

      <Divider dashed>Layout</Divider>

      <section className="flex flex-col gap-3">
        <Text strong>Flex e Pill</Text>
        <Flex
          gap="small"
          align="center"
        >
          <Pill>
            <Flame size={16} />
            <Text className="text-white">3 dias</Text>
          </Pill>
          <Divider orientation="vertical" />
          <Text type="secondary">Flex com gap, align e wrap</Text>
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>TextInput</Text>
        <TextInput
          placeholder="Seu nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Paragraph>Valor atual: {name || '(vazio)'}</Paragraph>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Typography</Text>
        <Title level={3}>Título nível 3</Title>
        <Paragraph>
          Este é um parágrafo de exemplo usando o componente Paragraph.
        </Paragraph>
        <Flex
          gap="small"
          wrap
        >
          <Text>Default</Text>
          <Text type="secondary">Secondary</Text>
          <Text type="danger">Danger</Text>
          <Text type="success">Success</Text>
          <Text strong>Strong</Text>
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Alert</Text>
        <Alert
          type="success"
          message="Progresso salvo com sucesso"
        />
        <Alert
          type="info"
          message="Novo desafio disponível"
          description="Volte amanhã para jogar a próxima fase."
        />
        {warningVisible && (
          <Alert
            type="warning"
            message="Sua sequência está em risco"
            closable
            onClose={() => setWarningVisible(false)}
          />
        )}
        <Alert
          type="error"
          message="Não foi possível carregar o desafio"
          action={<Button variant="chrome">Tentar novamente</Button>}
        />
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Tooltip e Popover</Text>
        <Flex
          gap="large"
          align="center"
        >
          <Tooltip title="Isso é uma dica">
            <Button variant="outlined">Passe o mouse</Button>
          </Tooltip>

          <Popover
            title="Mais informações"
            content="Este é o conteúdo do popover, pode ter qualquer coisa aqui."
            trigger="click"
          >
            <Button variant="outlined">Clique aqui</Button>
          </Popover>
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Modal</Text>
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
        >
          Abrir modal
        </Button>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Exemplo de Modal"
          footer={
            <Flex
              justify="end"
              gap="small"
            >
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => setModalOpen(false)}
              >
                Confirmar
              </Button>
            </Flex>
          }
        >
          <Paragraph>
            Este modal ocupa a tela toda com uma margem de 4 unidades, e só
            fecha pelo botão de X ou pelo footer.
          </Paragraph>
        </Modal>
      </section>
    </div>
  );
}
