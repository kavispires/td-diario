import { Alert } from '@components/ui/Alert';
import { Avatar } from '@components/ui/Avatar';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Carousel } from '@components/ui/Carousel';
import { Divider } from '@components/ui/Divider';
import { Flex } from '@components/ui/Flex';
import { IconButton } from '@components/ui/IconButton';
import { Image } from '@components/ui/Image';
import { Modal } from '@components/ui/Modal';
import { Pill } from '@components/ui/Pill';
import { Popconfirm } from '@components/ui/Popconfirm';
import { Popover } from '@components/ui/Popover';
import { Switch } from '@components/ui/Switch';
import { TextInput } from '@components/ui/TextInput';
import { Tooltip } from '@components/ui/Tooltip';
import { Paragraph, Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines/index';
import { notification } from '@utils/notification';
import { resetGameLocalState } from '@utils/resetGameLocalState';
import { Bell, Flame, Heart, Info, User } from 'lucide-react';
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
  const [switchOn, setSwitchOn] = useState(true);

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

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Avatar</Text>
        <Flex
          gap="small"
          align="center"
        >
          <Avatar size="small">AB</Avatar>
          <Avatar>CD</Avatar>
          <Avatar
            size="large"
            shape="square"
          >
            EF
          </Avatar>
          <Avatar icon={<User size={18} />} />
          <Avatar
            src="https://picsum.photos/seed/avatar/200"
            alt="Foto do usuário"
          />
          <Avatar src="https://broken-url.invalid/image.png">QR</Avatar>
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Badge</Text>
        <Flex
          gap="large"
          align="center"
        >
          <Badge count={5}>
            <IconButton
              icon={<Bell />}
              aria-label="Notificações"
            />
          </Badge>
          <Badge count={128}>
            <IconButton
              icon={<Bell />}
              aria-label="Notificações"
            />
          </Badge>
          <Badge dot>
            <IconButton
              icon={<Bell />}
              aria-label="Notificações"
            />
          </Badge>
          <Badge
            status="success"
            text="Online"
          />
          <Badge
            status="error"
            text="Offline"
          />
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Switch</Text>
        <Flex
          gap="large"
          align="center"
        >
          <Switch
            checked={switchOn}
            onChange={setSwitchOn}
            aria-label="Alternar exemplo"
          />
          <Switch
            size="small"
            defaultChecked
            aria-label="Alternar pequeno"
          />
          <Switch
            loading
            aria-label="Alternar carregando"
          />
          <Switch
            disabled
            aria-label="Alternar desabilitado"
          />
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Image</Text>
        <Flex gap="small">
          <Image
            src="https://picsum.photos/seed/showcase/300/200"
            alt="Imagem de exemplo"
            width={140}
            height={100}
          />
          <Image
            src="https://broken-url.invalid/image.png"
            alt="Imagem quebrada"
            width={140}
            height={100}
          />
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Popconfirm</Text>
        <Popconfirm
          title="Excluir este item?"
          description="Esta ação não pode ser desfeita."
          okVariant="primary"
          onConfirm={() => alert('Confirmado')}
          onCancel={() => alert('Cancelado')}
        >
          <Button variant="outlined">Excluir</Button>
        </Popconfirm>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Carousel</Text>
        <Carousel
          autoplay
          className="w-full max-w-xs"
        >
          <div className="flex h-40 items-center justify-center rounded-2xl bg-primary text-white">
            Slide 1
          </div>
          <div className="flex h-40 items-center justify-center rounded-2xl bg-secondary text-white">
            Slide 2
          </div>
          <div className="flex h-40 items-center justify-center rounded-2xl bg-accent text-white">
            Slide 3
          </div>
        </Carousel>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Notification</Text>
        <Flex
          wrap
          gap="small"
        >
          <Button
            variant="outlined"
            onClick={() => notification.success('Progresso salvo!')}
          >
            Success
          </Button>
          <Button
            variant="outlined"
            onClick={() => notification.error('Falha ao carregar desafio')}
          >
            Error
          </Button>
          <Button
            variant="outlined"
            onClick={() => notification.info('Novo desafio disponível')}
          >
            Info
          </Button>
          <Button
            variant="outlined"
            onClick={() => notification.warning('Sua sequência está em risco')}
          >
            Warning
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const key = notification.loading('Salvando...');
              window.setTimeout(() => {
                notification.update(key, {
                  type: 'success',
                  content: 'Salvo com sucesso!',
                  duration: 3000,
                });
              }, 1500);
            }}
          >
            Loading → Success
          </Button>
        </Flex>
      </section>

      <Divider />

      <section className="flex flex-col gap-3">
        <Text strong>Dev Tools</Text>
        <Flex
          wrap
          gap="small"
        >
          {Object.entries(gameInfos).map(([id, info]) => (
            <Popconfirm
              key={id}
              title={`Limpar o progresso de ${info.name.pt}?`}
              description="Remove o estado salvo localmente (progresso, jogadas, status) do dia de hoje."
              okVariant="primary"
              onConfirm={() => {
                resetGameLocalState(id);
                notification.success(`Estado de ${info.name.pt} limpo`);
              }}
            >
              <Button
                variant="outlined"
                size="small"
              >
                Limpar {info.name.pt}
              </Button>
            </Popconfirm>
          ))}
        </Flex>
      </section>
    </div>
  );
}
