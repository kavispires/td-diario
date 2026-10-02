import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Pill } from '@components/ui/Pill';
import { Text, Title } from '@components/ui/Typography';
import type {
  DailyInvestigacaoStatement,
  DailyInvestigacaoSuspect,
} from 'types/games';
import { getFeatureLabel } from '../utils/helpers';
import { Statements } from './Statements';
import { SuspectPortrait } from './SuspectPortrait';

/**
 * Props accepted by the {@link ReleaseModal} component.
 */
type ReleaseModalProps = {
  /**
   * Suspect currently selected for confirmation, or `null`.
   */
  suspect: DailyInvestigacaoSuspect | null;
  /**
   * Remaining extra clues.
   */
  hearts: number;
  /**
   * Suspect ids already released in the current run.
   */
  released: string[];
  /**
   * Main statements currently visible to the player.
   */
  statements: DailyInvestigacaoStatement[];
  /**
   * Bonus statements currently visible to the player.
   */
  additionalStatements: DailyInvestigacaoStatement[];
  /**
   * Called when the dialog should close without releasing the suspect.
   */
  onClose: () => void;
  /**
   * Confirms releasing the selected suspect.
   */
  onRelease: () => void;
};

/**
 * Confirmation modal opened when the player taps a suspect: previews the
 * portrait, translated feature tags, and current clues before release.
 *
 * @param props Selected suspect, visible clues, and action handlers.
 * @returns The rendered confirmation modal, or `null` when nothing is selected.
 */
export function ReleaseModal({
  suspect,
  hearts,
  released,
  statements,
  additionalStatements,
  onClose,
  onRelease,
}: ReleaseModalProps) {
  if (!suspect) {
    return null;
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Liberar ${suspect.name.pt.split(' ')[0]}?`}
      footer={
        <div className="flex gap-3">
          <Button
            variant="outlined"
            size="small"
            block
            onClick={onClose}
          >
            Não
          </Button>
          <Button
            variant="primary"
            size="small"
            block
            onClick={onRelease}
          >
            Sim, liberar
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[104px_1fr] gap-4">
          <SuspectPortrait
            suspectId={suspect.id}
            alt={`Retrato de ${suspect.name.pt}`}
          />

          <div className="flex min-w-0 flex-col gap-2">
            <Title level={4}>{suspect.name.pt}</Title>
            <Text type="secondary">
              Revise as características e confira se alguma pista ainda aponta
              para essa pessoa.
            </Text>
            <div className="flex flex-wrap gap-2">
              {suspect.features.map((feature) => (
                <Pill
                  key={feature}
                  className="bg-primary-soft px-3 py-1 text-xs text-primary shadow-none"
                >
                  {getFeatureLabel(feature, suspect.gender)}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-card px-4 py-4">
          <Text
            strong
            className="mb-3 block"
          >
            Declarações visíveis
          </Text>
          <Statements
            statements={statements}
            additionalStatements={additionalStatements}
            released={released}
          />
        </div>

        <Text
          type="secondary"
          className="text-center text-sm"
        >
          Dicas extras restantes: {hearts}
        </Text>
      </div>
    </Modal>
  );
}
