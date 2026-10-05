import { GameLogos } from '@components/hub/GameLogos';
import { Button } from '@components/ui/Button';
import { Text } from '@components/ui/Typography';
import { cn } from '@utils/cn';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import {
  IDEA_CATEGORIES,
  type IdeaCategoryOption,
  QUARTETOS_MINIMUM_ITEMS,
} from '../utils/constants';
import type { IdeaCategory, IdeaDraft } from '../utils/types';

/**
 * Shared Tailwind classes for every text field rendered in this form,
 * matching `TextInput`'s styling but allowing a `<textarea>` as well.
 */
const FIELD_CLASSES =
  'w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground placeholder:text-subtle-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft';

/**
 * Props accepted by the {@link IdeaForm} component.
 */
type IdeaFormProps = {
  /**
   * Category the player picked on the previous step.
   */
  category: IdeaCategory;
  /**
   * Whether the submission is currently being saved to the backend.
   */
  isSaving: boolean;
  /**
   * Returns to the category picker without submitting.
   */
  onBack: () => void;
  /**
   * Submits the collected draft for the current category.
   */
  onSubmit: (draft: IdeaDraft) => void;
};

/**
 * Renders the category-specific input fields for one idea submission,
 * validating that every required field is filled before enabling submit.
 *
 * @param props See {@link IdeaFormProps}.
 * @returns The rendered category form.
 */
export function IdeaForm({
  category,
  isSaving,
  onBack,
  onSubmit,
}: IdeaFormProps) {
  const option = IDEA_CATEGORIES.find(
    (current) => current.id === category,
  ) as IdeaCategoryOption;

  const [expression, setExpression] = useState('');
  const [movie, setMovie] = useState('');
  const [question, setQuestion] = useState('');
  const [location, setLocation] = useState('');
  const [theme, setTheme] = useState('');
  const [items, setItems] = useState<string[]>(['', '', '', '']);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [lyric, setLyric] = useState('');
  const [year, setYear] = useState('');
  const [historyEvent, setHistoryEvent] = useState('');
  const [feedback, setFeedback] = useState('');

  const filledItems = items.map((item) => item.trim()).filter(Boolean);

  const canSubmit = (() => {
    switch (category) {
      case 'arte-ruim':
        return expression.trim().length > 0;
      case 'filmaco':
        return movie.trim().length > 0;
      case 'investigacao':
        return question.trim().length > 0;
      case 'mapeamento':
        return location.trim().length > 0;
      case 'quartetos':
        return (
          theme.trim().length > 0 &&
          filledItems.length >= QUARTETOS_MINIMUM_ITEMS
        );
      case 'karaoke':
        return (
          title.trim().length > 0 &&
          artist.trim().length > 0 &&
          lyric.trim().length > 0
        );
      case 'epocas':
        return year.trim().length > 0 && historyEvent.trim().length > 0;
      case 'general':
        return feedback.trim().length > 0;
      default:
        return false;
    }
  })();

  /**
   * Adds another blank item input to the Quartetos form.
   */
  function addItem() {
    setItems((previousItems) => [...previousItems, '']);
  }

  /**
   * Updates one item input's value in the Quartetos form.
   *
   * @param index - Position of the item being edited.
   * @param value - New value for that item.
   */
  function updateItem(index: number, value: string) {
    setItems((previousItems) =>
      previousItems.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    );
  }

  /**
   * Builds the draft for the current category and submits it.
   */
  function handleSubmit() {
    if (!canSubmit || isSaving) {
      return;
    }

    switch (category) {
      case 'arte-ruim':
        onSubmit({ expression: expression.trim() });
        return;
      case 'filmaco':
        onSubmit({ movie: movie.trim() });
        return;
      case 'investigacao':
        onSubmit({ question: question.trim() });
        return;
      case 'mapeamento':
        onSubmit({ location: location.trim() });
        return;
      case 'quartetos':
        onSubmit({ theme: theme.trim(), items: filledItems });
        return;
      case 'karaoke':
        onSubmit({
          title: title.trim(),
          artist: artist.trim(),
          lyric: lyric.trim(),
        });
        return;
      case 'epocas':
        onSubmit({ year: year.trim(), event: historyEvent.trim() });
        return;
      case 'general':
        onSubmit({ feedback: feedback.trim() });
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 self-start text-sm text-muted-foreground"
      >
        <ChevronLeft
          className="h-4 w-4"
          aria-hidden="true"
        />
        Trocar categoria
      </button>

      <Text
        strong
        className="flex items-center gap-1.5 text-lg"
      >
        <span
          className="flex h-6 w-6 items-center justify-center text-2xl"
          aria-hidden="true"
        >
          {option.gameId ? (
            <GameLogos
              gameId={option.gameId}
              className="h-full w-full"
            />
          ) : (
            option.emoji
          )}
        </span>
        {option.label}
      </Text>
      <Text type="secondary">{option.description}</Text>

      {category === 'arte-ruim' && (
        <Field
          id="idea-expression"
          label="Expressão"
        >
          <input
            id="idea-expression"
            className={FIELD_CLASSES}
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            placeholder="Ex: Pomba lesa"
          />
        </Field>
      )}

      {category === 'filmaco' && (
        <Field
          id="idea-movie"
          label="Filme"
        >
          <input
            id="idea-movie"
            className={FIELD_CLASSES}
            value={movie}
            onChange={(event) => setMovie(event.target.value)}
            placeholder="Ex: De Volta Para o Futuro"
          />
        </Field>
      )}

      {category === 'investigacao' && (
        <Field
          id="idea-question"
          label="Pergunta do depoimento"
          hint="Evite perguntas diretamente sobre aparência física."
        >
          <textarea
            id="idea-question"
            className={cn(FIELD_CLASSES, 'min-h-24 resize-none')}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ex: Essa pessoa já morou em outro país?"
          />
        </Field>
      )}

      {category === 'mapeamento' && (
        <Field
          id="idea-location"
          label="Local"
        >
          <input
            id="idea-location"
            className={FIELD_CLASSES}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Ex: Torre Eiffel"
          />
        </Field>
      )}

      {category === 'quartetos' && (
        <>
          <Field
            id="idea-theme"
            label="Tema"
          >
            <input
              id="idea-theme"
              className={FIELD_CLASSES}
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              placeholder="Ex: Instrumentos de corda"
            />
          </Field>
          <Field
            id="idea-item-0"
            label={`Itens (mínimo ${QUARTETOS_MINIMUM_ITEMS})`}
          >
            <div className="flex flex-col gap-2">
              {items.map((item, index) => (
                <input
                  key={index}
                  id={`idea-item-${index}`}
                  aria-label={`Item ${index + 1}`}
                  className={FIELD_CLASSES}
                  value={item}
                  onChange={(event) => updateItem(index, event.target.value)}
                  placeholder={`Item ${index + 1}`}
                />
              ))}
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={addItem}
              >
                Adicionar item
              </Button>
            </div>
          </Field>
        </>
      )}

      {category === 'karaoke' && (
        <>
          <Field
            id="idea-title"
            label="Título da música"
          >
            <input
              id="idea-title"
              className={FIELD_CLASSES}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex: Garota de Ipanema"
            />
          </Field>
          <Field
            id="idea-artist"
            label="Artista"
          >
            <input
              id="idea-artist"
              className={FIELD_CLASSES}
              value={artist}
              onChange={(event) => setArtist(event.target.value)}
              placeholder="Ex: Tom Jobim"
            />
          </Field>
          <Field
            id="idea-lyric"
            label="Trecho da letra"
          >
            <textarea
              id="idea-lyric"
              className={cn(FIELD_CLASSES, 'min-h-24 resize-none')}
              value={lyric}
              onChange={(event) => setLyric(event.target.value)}
              placeholder="Ex: Olha que coisa mais linda..."
            />
          </Field>
        </>
      )}

      {category === 'epocas' && (
        <>
          <Field
            id="idea-year"
            label="Ano"
          >
            <input
              id="idea-year"
              className={FIELD_CLASSES}
              value={year}
              onChange={(event) => setYear(event.target.value)}
              placeholder="Ex: 1969"
            />
          </Field>
          <Field
            id="idea-event"
            label="Acontecimento"
          >
            <textarea
              id="idea-event"
              className={cn(FIELD_CLASSES, 'min-h-24 resize-none')}
              value={historyEvent}
              onChange={(changeEvent) =>
                setHistoryEvent(changeEvent.target.value)
              }
              placeholder="Ex: Chegada do homem à Lua"
            />
          </Field>
        </>
      )}

      {category === 'general' && (
        <Field
          id="idea-feedback"
          label="Sua ideia ou feedback"
        >
          <textarea
            id="idea-feedback"
            className={cn(FIELD_CLASSES, 'min-h-32 resize-none')}
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Conte pra gente o que você está pensando"
          />
        </Field>
      )}

      <Button
        variant="primary"
        size="small"
        disabled={!canSubmit}
        loading={isSaving}
        onClick={handleSubmit}
      >
        Enviar ideia
      </Button>
    </div>
  );
}

/**
 * Props accepted by the {@link Field} component.
 */
type FieldProps = {
  /**
   * Id shared between the label and its associated input/textarea.
   */
  id: string;
  /**
   * Label shown above the field.
   */
  label: string;
  /**
   * Optional helper text shown below the label.
   */
  hint?: string;
  /**
   * The field's input element(s).
   */
  children: React.ReactNode;
};

/**
 * Renders a labeled form field, used by every category-specific input in
 * {@link IdeaForm}.
 *
 * @param props See {@link FieldProps}.
 * @returns The rendered field.
 */
function Field({ id, label, hint, children }: FieldProps) {
  return (
    <label
      htmlFor={id}
      className="flex flex-col gap-1 text-sm font-medium text-muted-foreground"
    >
      {label}
      {hint && (
        <Text
          type="secondary"
          className="text-xs font-normal"
        >
          {hint}
        </Text>
      )}
      {children}
    </label>
  );
}
