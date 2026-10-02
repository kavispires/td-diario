import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Text, Title } from '@components/ui/Typography';
import { useCardWidthByContainerRef } from '@hooks/useCardWidth';
import { useMemo } from 'react';
import type { DailyPirralhosKidEntry } from 'types/games';
import { KIDS_LIBRARY } from '../utils/constants';
import { KidPortrait } from './KidPortrait';

/**
 * Props accepted by the {@link SolveModal} component.
 */
type SolveModalProps = {
  /**
   * Whether the accusation picker is visible.
   */
  open: boolean;
  /**
   * Called when the picker should close without accusing anyone.
   */
  onClose: () => void;
  /**
   * All kids visible in today's mystery.
   */
  kids: DailyPirralhosKidEntry[];
  /**
   * Kid ids already accused unsuccessfully, which should not be offered again.
   */
  guesses: string[];
  /**
   * Resolves the mystery attempt for the selected kid.
   */
  onResolve: (kidId: string) => void;
};

/**
 * Modal accusation picker used to choose which kid to blame next.
 *
 * @param props Visibility, candidate list, already-tried guesses, and the
 *   resolution callback.
 * @returns The rendered accusation picker modal.
 */
export function SolveModal({
  open,
  onClose,
  kids,
  guesses,
  onResolve,
}: SolveModalProps) {
  const [cardWidth, containerRef] = useCardWidthByContainerRef(2, {
    margin: 16,
    gap: 20,
    minWidth: 110,
    maxWidth: 160,
  });

  const availableKids = useMemo(
    () =>
      kids
        .filter((kidEntry) => !guesses.includes(kidEntry.kidId))
        .sort((left, right) => {
          const leftName = KIDS_LIBRARY[left.kidId]?.name.pt ?? left.kidId;
          const rightName = KIDS_LIBRARY[right.kidId]?.name.pt ?? right.kidId;
          return leftName.localeCompare(rightName, 'pt-BR');
        }),
    [kids, guesses],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Quem pegou o brinquedo?"
    >
      {availableKids.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
          <Title level={4}>Sem suspeitos restantes</Title>
          <Text type="secondary">
            Você já acusou todos os nomes possíveis para hoje.
          </Text>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="grid grid-cols-2 gap-4"
        >
          {availableKids.map((kidEntry) => {
            const kid = KIDS_LIBRARY[kidEntry.kidId];
            if (!kid) {
              return null;
            }

            return (
              <div
                key={kidEntry.kidId}
                className="flex flex-col items-center gap-2 rounded-[1.75rem] bg-card px-3 py-4 text-center shadow-sm"
              >
                <KidPortrait
                  kid={kid}
                  width={cardWidth}
                  showName
                />
                <Text className="text-xs text-subtle-foreground">
                  {kid.height} cm
                </Text>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    onResolve(kid.id);
                    onClose();
                  }}
                >
                  Selecionar
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
