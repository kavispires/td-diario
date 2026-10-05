import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import type { ShareResult } from '@utils/shareResults';
import { Puzzle, Share2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Props accepted by the {@link GameResultsSplash} component.
 */
type GameResultsSplashProps = {
  /**
   * Id of the game that owns this results splash, used to look up its logo
   * and tint color.
   */
  gameId: keyof typeof gameInfos;
  /**
   * Headline shown below the game logo.
   */
  title: ReactNode;
  /**
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
  /**
   * Result shared or copied to the clipboard when the player taps
   * "Compartilhar Resultados", built by the game's `buildShare` function.
   * Falls back to a generic message mentioning the game's name when
   * omitted.
   */
  share?: ShareResult;
  /**
   * Game-specific recap content rendered between the title and the footer
   * actions.
   */
  children: ReactNode;
};

/**
 * Shared fullscreen results splash used by every game: renders the game's
 * tinted overlay, logo, and title, then delegates the recap content to
 * `children`, and always offers the same three footer actions (share the
 * result, return to the Hub, or close the overlay).
 *
 * @param props Game id, title, close handler, optional share result, and
 * recap content.
 * @returns The rendered results splash.
 */
export function GameResultsSplash({
  gameId,
  title,
  onClose,
  share,
  children,
}: GameResultsSplashProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const gameInfo = gameInfos[gameId];

  /**
   * Shares (or copies to the clipboard as a fallback) a short recap of
   * today's result, using the Web Share API when available. Always links
   * back to the app's root/hub, never an individual game route, and
   * inserts "TD Diário" between the game's emoji and name in the shared
   * title. The full message (title, body, and link) is folded into a
   * single `text` blob — some share targets reorder or drop the separate
   * `title`/`url` fields of the Web Share API, so passing just one string
   * is the only way to guarantee the exact shared/copied content.
   */
  const handleShare = async () => {
    const result: ShareResult = share ?? {
      title: `${gameInfo.emoji} ${gameInfo.name.pt}`,
      text: `Joguei ${gameInfo.name.pt} hoje no TD Diário!`,
      url: window.location.origin,
    };
    const shareTitle = `${gameInfo.emoji} TD Diário ${result.title
      .slice(gameInfo.emoji.length)
      .trim()}`;
    const fullText = [shareTitle, result.text, result.url]
      .filter(Boolean)
      .join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ text: fullText });
      } catch {
        // Player dismissed the native share sheet; nothing to do.
      }
      return;
    }

    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.65 }}
        animate={{ opacity: 1, scale: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="fixed inset-0 z-100 overflow-y-auto px-6 py-8"
        style={{ backgroundColor: withAlpha(gameInfo.color, 0.97) }}
      >
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center gap-4">
          <div className="h-16 w-16">
            <GameLogos
              gameId={gameId}
              className="h-full w-full drop-shadow-sm"
            />
          </div>

          <Title
            level={2}
            className="text-center text-foreground"
          >
            {title}
          </Title>

          {children}

          <div className="flex w-full flex-col gap-2 pt-4">
            <Button
              variant="primary"
              size="small"
              icon={<Share2 />}
              block
              onClick={handleShare}
            >
              Compartilhar Resultados
            </Button>
            <Button
              variant="outlined"
              size="small"
              icon={<Puzzle />}
              block
              onClick={() => navigate('/')}
            >
              Voltar ao Hub
            </Button>
            <Button
              variant="ghost"
              size="small"
              block
              onClick={onClose}
            >
              Ver jogo
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
