import { Button } from '@components/ui/Button';
import { Checkbox } from '@components/ui/Checkbox';
import { Modal } from '@components/ui/Modal';
import { Text, Title } from '@components/ui/Typography';
import { buildGroupedShareResult } from '@engines/groupedShareRegistry';
import {
  type GameProgressEntry,
  useGameProgress,
} from '@hooks/useGameProgress';
import { useGetDailyChallenges } from '@hooks/useGetDailyChallenges';
import { withAlpha } from '@utils/helpers';
import { formatShareDate, SHARE_URL } from '@utils/shareResults';
import { orderBy } from 'lodash';
import { Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { GameLogos } from './GameLogos';

/**
 * Props accepted by the {@link GroupedShareModal} component.
 */
type GroupedShareModalProps = {
  /**
   * Whether the modal is visible.
   */
  open: boolean;
  /**
   * Called to dismiss the modal.
   */
  onClose: () => void;
};

/**
 * Builds the combined clipboard text for every selected game: a
 * `"TD Diário DD-MM-YYYY"` header, each selected game's title and body
 * separated by a blank line, and the hub URL exactly once at the end.
 *
 * @param dateId - Today's challenge id (`YYYY-MM-DD`).
 * @param entries - The selected games' progress entries, paired with their
 *   already-built share results.
 * @returns The assembled multi-game share text.
 */
function buildGroupedShareText(
  dateId: string,
  entries: { entry: GameProgressEntry; title: string; text: string }[],
): string {
  const header = `TD Diário ${formatShareDate(dateId)}`;
  const body = entries
    .map(({ title, text }) => [title, text].filter(Boolean).join('\n'))
    .join('\n\n');

  return [header, body, SHARE_URL].filter(Boolean).join('\n\n');
}

/**
 * Renders the Hub's "Resultados agrupados" modal: a checklist of every
 * game played today, each tinted with its theme color, letting the player
 * copy a single combined recap of their selected games' results to the
 * clipboard.
 *
 * @param props Visibility and close handler.
 * @returns The rendered grouped-share modal.
 */
export function GroupedShareModal({ open, onClose }: GroupedShareModalProps) {
  const { data } = useGetDailyChallenges();
  const { entries } = useGameProgress();
  const [copied, setCopied] = useState(false);

  const playedEntries = useMemo(
    () =>
      orderBy(
        entries.filter((entry) => entry.state === 'completed'),
        'info.name.pt',
        'asc',
      ),
    [entries],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(playedEntries.map((entry) => entry.key)),
  );

  function toggleGame(key: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleShare() {
    if (!data) {
      return;
    }

    const selectedResults = playedEntries
      .filter((entry) => selectedIds.has(entry.key))
      .map((entry) => {
        const result = buildGroupedShareResult(entry.key, entry.challenge);
        return result && { entry, title: result.title, text: result.text };
      })
      .filter(
        (
          value,
        ): value is { entry: GameProgressEntry; title: string; text: string } =>
          Boolean(value),
      );

    const text = buildGroupedShareText(data.id, selectedResults);

    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // Player dismissed the native share sheet; nothing to do.
      }
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Resultados agrupados"
      footer={
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="small"
            icon={<Share2 />}
            block
            disabled={selectedIds.size === 0}
            onClick={handleShare}
          >
            Compartilhar Resultados
          </Button>
          {copied && (
            <Text
              type="secondary"
              className="text-center"
            >
              Copiado para a área de transferência!
            </Text>
          )}
        </div>
      }
    >
      <Text
        type="secondary"
        className="pb-4"
      >
        Selecione os jogos que você deseja enviar os resultados e então clique
        em compartilhar.
      </Text>

      {playedEntries.length === 0 ? (
        <Text type="secondary">Você ainda não jogou nenhum jogo hoje.</Text>
      ) : (
        <div className="flex flex-col gap-1">
          {playedEntries.map((entry) => (
            <div
              key={entry.key}
              className="flex items-center gap-2 rounded-lg p-1.5"
              style={{ backgroundColor: withAlpha(entry.info.color, 0.4) }}
            >
              <Checkbox
                checked={selectedIds.has(entry.key)}
                onChange={() => toggleGame(entry.key)}
                aria-label={`Incluir ${entry.info.name.pt}`}
              />
              <div className="h-5 w-5 shrink-0">
                <GameLogos
                  gameId={entry.info.id}
                  className="h-full w-full"
                />
              </div>
              <Title
                level={3}
                className="text-xs"
              >
                {entry.info.name.pt}
              </Title>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
