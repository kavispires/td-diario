import { GameResultsSplash } from '@components/games/GameResultsSplash';
import { Hearts } from '@components/games/Hearts';
import { Score } from '@components/games/Score';
import { Divider } from '@components/ui/Divider';
import { Surface } from '@components/ui/Surface';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import {
  MIN_REQUIRED_PAIRS,
  RESULTS_PAIR_CARD_WIDTH,
} from '../utils/constants';
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
  const relatedPairsPreviewCount = Math.min(
    relatedPairs.length,
    MIN_REQUIRED_PAIRS,
  );

  return (
    <GameResultsSplash
      gameId="conexoes"
      title={win ? 'Conexões enviadas!' : 'Sessão encerrada'}
      onClose={onClose}
    >
      <Text
        strong
        className="text-center text-black"
      >
        {win
          ? 'Estas foram as relações que você decidiu salvar hoje:'
          : 'Hoje nenhuma relação chegou a entrar no banco do TD.'}
      </Text>

      <Hearts
        remaining={relatedPairsPreviewCount}
        total={MIN_REQUIRED_PAIRS}
        emptyClassName="text-black"
        filledClassName="text-black"
      />

      <div
        className={cn(
          'rounded-full px-4 py-2 text-center text-sm font-semibold',
          win ? 'bg-gold text-chrome' : 'bg-white/70 text-foreground',
        )}
      >
        {win
          ? 'Valeu pela curadoria — essas conexões ajudam o TD a montar desafios futuros.'
          : 'Nem todo dia rende boas conexões. Amanhã chegam novos pares para avaliar.'}
      </div>

      {win && relatedPairs.length > 0 && (
        <div className="grid w-full gap-3">
          {relatedPairs.map((pair, index) => (
            <Surface
              key={createPairId(pair.imageId1, pair.imageId2)}
              className="bg-white/75 p-4"
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
                  width={RESULTS_PAIR_CARD_WIDTH}
                />
                <PairImageCard
                  imageId={pair.imageId2}
                  label={`Segunda imagem da ligação ${index + 1}`}
                  width={RESULTS_PAIR_CARD_WIDTH}
                />
              </div>
            </Surface>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <Text
          type="secondary"
          className="text-center text-black"
        >
          {relatedPairs.length} de {evaluatedCount} pares renderam relações
          salvas
        </Text>
        <Divider orientation="vertical" />
        <Score
          value={score}
          className="text-black"
        />
      </div>
    </GameResultsSplash>
  );
}
