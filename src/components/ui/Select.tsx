import { Popover } from '@components/ui/Popover';
import { cn } from '@utils/cn';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

/**
 * A single choice rendered in a {@link Select}'s option list.
 */
type SelectOption = {
  /**
   * Value reported to `onChange` when this option is picked.
   */
  value: string;
  /**
   * Text shown for this option, both in the list and as the selected
   * value on the trigger button.
   */
  label: string;
};

/**
 * Props accepted by the {@link Select} component.
 */
type SelectProps = {
  /**
   * Currently selected option's value.
   */
  value: string;
  /**
   * Called with the newly picked option's value.
   */
  onChange: (value: string) => void;
  /**
   * Choices rendered in the dropdown, in order.
   */
  options: SelectOption[];
  /**
   * Additional class names applied to the trigger button.
   */
  className?: string;
};

/**
 * Renders a custom-styled single-choice dropdown, consistent with the rest
 * of the UI kit. Used instead of a native `<select>`, whose options list is
 * rendered by the OS/browser and can't be themed.
 *
 * @param props Selected value, change handler, and available options.
 * @returns A trigger button that opens a floating list of options.
 */
export function Select({ value, onChange, options, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <Popover
      trigger="click"
      placement="bottom"
      open={open}
      onOpenChange={setOpen}
      content={
        <div
          role="listbox"
          className="flex max-h-60 min-w-40 flex-col gap-0.5 overflow-y-auto"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                'flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primary-soft',
                option.value === value &&
                  'bg-primary-soft font-semibold text-primary',
              )}
            >
              {option.label}
              {option.value === value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      }
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-xl border-2 border-border bg-white px-4 py-3 text-base text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-soft',
          className,
        )}
      >
        {selected?.label ?? 'Selecione'}
        <ChevronDown className="h-4 w-4 shrink-0 text-subtle-foreground" />
      </button>
    </Popover>
  );
}
