import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { createPairId } from '../utils/helpers';
import type { RelatedPair } from '../utils/types';
import { PairImageCard } from './PairImageCard';

/**
 * Props accepted by the {@link ResultsSplash} component.
 */
type ResultsSplashProps = {
  /**
   * Whether the current run ended with saved related pairs.
   */
  win: boolean;
  /**
   * Number of pairs evaluated during today's run.
   */
  evaluatedCount: number;
  /**
   * Related pairs found during today's run.
   */
  relatedPairs: RelatedPair[];
  /**
   * Final score accumulated for today's run.
   */
  score: number;
  /**
   * Called to dismiss the splash and return to the completed game view.
   */
  onClose: () => void;
};

/**
 * Fullscreen Conexões results splash shown after the run is complete: it
 * recaps how many pairs were reviewed, lists every saved relation, and
 * offers to either return to the Hub or close the overlay.
 *
 * @param props Completion outcome, run stats, related pairs, and close handler.
 * @returns The rendered results splash.
 */
export function ResultsSplash({
  win,
  evaluatedCount,
  relatedPairs,
  score,
  onClose,
}: ResultsSplashProps) {
  return (
    <GameResultsSplash
      gameId="conexoes"
      title={win ? 'Conexões enviadas!' : 'Sessão encerrada'}
      onClose={onClose}
    >
      <div
        className={cn(
          'rounded-full px-4 py-2 text-center text-sm font-semibold',
          win ? 'bg-gold text-chrome' : 'bg-white/70 text-foreground',
        )}
      >
        {win
          ? `${relatedPairs.length} relações salvas em ${evaluatedCount} pares avaliados`
          : `${evaluatedCount} pares avaliados e nenhuma relação salva`}
      </div>

      <Text
        type="secondary"
        className="text-center"
      >
        {win
          ? 'Valeu pela curadoria — essas conexões ajudam o TD a montar desafios futuros.'
          : 'Nem todo dia rende boas conexões. Amanhã chegam novos pares para avaliar.'}
      </Text>

      {win && relatedPairs.length > 0 && (
        <div className="grid w-full gap-3">
          {relatedPairs.map((pair, index) => (
            <div
              key={createPairId(pair.imageId1, pair.imageId2)}
              className="rounded-[2rem] bg-white/75 p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <Text strong>Ligação #{index + 1}</Text>
                <Text
                  type="secondary"
                  className="text-sm"
                >
                  Par salvo
                </Text>
              </div>

              <div className="grid grid-cols-2 justify-items-center gap-3">
                <PairImageCard
                  imageId={pair.imageId1}
                  label={`Primeira imagem da ligação ${index + 1}`}
                  width={120}
                />
                <PairImageCard
                  imageId={pair.imageId2}
                  label={`Segunda imagem da ligação ${index + 1}`}
                  width={120}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <Text
        type="secondary"
        className="text-center"
      >
        Pontuação final: {score}
      </Text>
    </GameResultsSplash>
  );
}
