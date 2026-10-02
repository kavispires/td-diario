import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text, Title } from '@components/ui/Typography';
import { gameInfos } from '@engines';
import { withAlpha } from '@utils/helpers';
import { useNavigate } from 'react-router-dom';

const WORD_TONE_CLASSES = [
  'bg-red-500 text-white',
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
  'bg-amber-700 text-white',
  'bg-orange-500 text-white',
] as const;

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the player solved every row.
   */
  win: boolean;
  /**
   * Remaining hearts at the end of the game.
   */
  hearts: number;
  /**
   * Correct row words for today's challenge.
   */
  words: string[];
  /**
   * Number of swaps made during the run.
   */
  swaps: number;
  /**
   * Final score achieved for the day.
   */
  score: number;
  /**
   * Whether the one-time smart shuffle hint was used.
   */
  usedSmartShuffle: boolean;
  /**
   * Called to dismiss the splash and return to the completed board.
   */
  onClose: () => void;
};

/**
 * Fullscreen Palavreado results splash shown after a win or loss, recapping
 * the answer words and final stats.
 *
 * @param props - Result state, recap stats, and dismiss handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  hearts,
  words,
  swaps,
  score,
  usedSmartShuffle,
  onClose,
}: ResultsSplashProps) {
  const navigate = useNavigate();
  const gameInfo = gameInfos.palavreado;

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-5 px-6"
      style={{ backgroundColor: withAlpha(gameInfo.color, 0.85) }}
    >
      <div className="h-16 w-16">
        <GameLogos
          gameId="palavreado"
          className="h-full w-full drop-shadow-sm"
        />
      </div>

      <Title
        level={2}
        className="text-center text-foreground"
      >
        {win ? 'Parabéns!' : 'Que pena!'}
      </Title>

      <div
        className={`flex w-full max-w-xs flex-col gap-4 rounded-[2rem] px-5 py-6 text-center shadow-sm ${
          win ? 'bg-gold-soft' : 'bg-surface-raised/90'
        }`}
      >
        <Text strong>
          {win
            ? 'Você reorganizou todas as palavras.'
            : 'As palavras de hoje eram estas:'}
        </Text>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {words.map((word, index) => (
            <span
              key={`${index}-${word}`}
              className={`rounded-md px-3 py-1 font-mono text-sm font-semibold uppercase tracking-wide ${
                WORD_TONE_CLASSES[index] ??
                WORD_TONE_CLASSES[WORD_TONE_CLASSES.length - 1]
              }`}
            >
              {word}
            </span>
          ))}
        </div>

        <div className="space-y-1 text-sm text-foreground">
          <p>Pontuação final: {score}</p>
          <p>Trocas usadas: {swaps}</p>
          <p>Vidas restantes: {hearts}</p>
          <p>{usedSmartShuffle ? 'Dica usada: sim' : 'Dica usada: não'}</p>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          variant="chrome"
          size="small"
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
          Fechar
        </Button>
      </div>
    </div>
  );
}
