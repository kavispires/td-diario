import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Popconfirm } from '@components/ui/Popconfirm';
import { Paragraph } from '@components/ui/Typography';
import { notification } from '@utils/notification';
import { resetGameLocalState } from '@utils/resetGameLocalState';
import { Bug, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { GameInfo } from 'types/puzzles';

/**
 * Props accepted by the {@link GameSecretMenu} component.
 */
type GameSecretMenuProps = {
  /**
   * Whether the menu is visible.
   */
  open: boolean;
  /**
   * Called when the menu should close.
   */
  onClose: () => void;
  /**
   * The currently active game, whose local state the reset action targets.
   */
  gameInfo: GameInfo;
};

/**
 * Hidden maintenance menu, revealed by tapping the game number repeatedly in
 * `ChromeHeader`. Lets a user reset the active game's locally-persisted
 * "today" state, or report a bug (placeholder, not yet wired to anything).
 *
 * @param props Visibility, close handler, and the active game's info.
 * @returns The secret menu modal.
 */
export function GameSecretMenu({
  open,
  onClose,
  gameInfo,
}: GameSecretMenuProps) {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Menu secreto"
    >
      <div className="flex flex-col gap-4">
        <div>
          <Paragraph className="mb-2 text-sm text-muted-foreground">
            Reinicia o progresso local de hoje de{' '}
            <strong>{gameInfo.name.pt}</strong>, como se você ainda não tivesse
            jogado.
          </Paragraph>
          <Popconfirm
            title="Reiniciar progresso?"
            description="Essa ação não pode ser desfeita."
            okText="Reiniciar"
            okVariant="primary"
            onConfirm={() => {
              resetGameLocalState(gameInfo);
              notification.success(`Progresso de ${gameInfo.name.pt} limpo`);
              onClose();
              navigate('/');
            }}
          >
            <Button
              variant="outlined"
              size="small"
              icon={<RotateCcw size={14} />}
              block
            >
              Reiniciar progresso de hoje
            </Button>
          </Popconfirm>
        </div>

        <div>
          <Paragraph className="mb-2 text-sm text-muted-foreground">
            Encontrou um problema em {gameInfo.name.pt}?
          </Paragraph>
          <Button
            variant="outlined"
            size="small"
            icon={<Bug size={14} />}
            block
            disabled
            onClick={() =>
              notification.info('Em breve você poderá reportar bugs por aqui.')
            }
          >
            Reportar um erro
          </Button>
        </div>
      </div>
    </Modal>
  );
}
