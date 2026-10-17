import { NewsEntryItem } from '@components/news/NewsEntryItem';
import { Modal } from '@components/ui/Modal';
import { Paragraph } from '@components/ui/Typography';
import { NEWS_ENTRIES } from '@data/news';
import { useUserPreferencesStore } from '@store/useUserPreferencesStore';
import { getRealToday } from '@utils/helpers';
import { getVisibleNewsEntries } from '@utils/news';
import { useEffect } from 'react';

/**
 * Props accepted by the {@link NewsModal} component.
 */
type NewsModalProps = {
  /**
   * Whether the modal is visible.
   */
  open: boolean;
  /**
   * Called when the modal should close.
   */
  onClose: () => void;
};

/**
 * Renders the modal listing all currently-visible news entries (newest
 * first). Marks the newest entry's date as seen (via
 * `useUserPreferencesStore`'s `lastSeenNews`) as soon as it's opened, so
 * the header's notification dot clears.
 *
 * @param props Visibility and close handler.
 * @returns The news feed modal.
 */
export function NewsModal({ open, onClose }: NewsModalProps) {
  const setLastSeenNews = useUserPreferencesStore(
    (state) => state.setLastSeenNews,
  );
  const visibleEntries = getVisibleNewsEntries(NEWS_ENTRIES, getRealToday());

  // biome-ignore lint/correctness/useExhaustiveDependencies: only re-run when the modal opens, not on every entries/store change
  useEffect(() => {
    if (open && visibleEntries[0]) {
      setLastSeenNews(visibleEntries[0].date);
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novidades"
    >
      {visibleEntries.length === 0 ? (
        <Paragraph className="text-foreground/70">
          Nenhuma novidade por aqui ainda.
        </Paragraph>
      ) : (
        <div className="flex flex-col">
          {visibleEntries.map((entry) => (
            <NewsEntryItem
              key={`${entry.date}-${entry.gameId ?? entry.type}-${entry.description}`}
              entry={entry}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}
