import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Surface } from '@components/ui/Surface';
import { Text, Title } from '@components/ui/Typography';
import { useState } from 'react';
import type { DailyIdeiasEntry } from 'types/games';
import { gameInfo } from '../info';
import { IDEA_CATEGORIES } from '../utils/constants';
import { getInitialState } from '../utils/helpers';
import type { IdeaCategory } from '../utils/types';
import { useIdeiasEngine } from '../utils/useIdeiasEngine';
import { IdeaForm } from './IdeaForm';

/**
 * Props accepted by the {@link IdeiasGame} component.
 */
type IdeiasGameProps = {
  /**
   * Today's Ideias payload, as resolved by `GameScreen`.
   */
  data: DailyIdeiasEntry;
};

/**
 * Renders the full Ideias contribution flow: a category picker, a
 * category-specific submission form, and a thank-you screen once at least
 * one idea has been submitted today.
 *
 * @param props Today's Ideias payload.
 * @returns The rendered Ideias screen.
 */
export function IdeiasGame({ data }: IdeiasGameProps) {
  const [initialState] = useState(() => getInitialState(data));
  const {
    isIdle,
    isWin,
    isSaving,
    submissionCount,
    isSubmittingAnother,
    startAnother,
    submitIdea,
  } = useIdeiasEngine(data, initialState);

  const [selectedCategory, setSelectedCategory] = useState<IdeaCategory | null>(
    null,
  );

  function handleBack() {
    setSelectedCategory(null);
  }

  function handleStartAnother() {
    setSelectedCategory(null);
    startAnother();
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 pb-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <Title level={3}>{gameInfo.name.pt}</Title>
        <Text type="secondary">
          Ajude a criar novos conteúdos para os jogos do TD Diário.
        </Text>
      </div>

      {isWin && !isSubmittingAnother && (
        <Surface className="flex w-full flex-col items-center gap-4 bg-gold-soft px-5 py-6 text-center">
          <Title level={4}>Obrigado pela contribuição!</Title>
          <Text type="secondary">
            Você já enviou {submissionCount}{' '}
            {submissionCount === 1 ? 'ideia' : 'ideias'} hoje. Pode mandar mais
            quando quiser.
          </Text>
          <Button
            variant="primary"
            size="small"
            onClick={handleStartAnother}
          >
            Enviar outra ideia
          </Button>
        </Surface>
      )}

      {isIdle && !selectedCategory && (
        <div className="grid w-full grid-cols-2 gap-3">
          {IDEA_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className="flex flex-col items-center gap-1 rounded-2xl border-2 border-border bg-card px-3 py-4 text-center transition-colors hover:border-primary"
            >
              <span
                className="flex h-6 w-6 items-center justify-center text-2xl"
                aria-hidden="true"
              >
                {category.gameId ? (
                  <GameLogos
                    gameId={category.gameId}
                    className="h-full w-full"
                  />
                ) : (
                  category.emoji
                )}
              </span>
              <Text strong>{category.label}</Text>
            </button>
          ))}
        </div>
      )}

      {isIdle && selectedCategory && (
        <IdeaForm
          category={selectedCategory}
          isSaving={isSaving}
          onBack={handleBack}
          onSubmit={(draft) => submitIdea(selectedCategory, draft)}
        />
      )}
    </div>
  );
}
