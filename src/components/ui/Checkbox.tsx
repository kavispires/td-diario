import { cn } from '@utils/cn';
import { Check } from 'lucide-react';

/**
 * Props accepted by the {@link Checkbox} component.
 */
type CheckboxProps = {
  /**
   * Whether the checkbox is checked.
   */
  checked: boolean;
  /**
   * Called whenever the player toggles the checkbox.
   */
  onChange: (checked: boolean) => void;
  /**
   * Disables the checkbox, preventing interaction.
   */
  disabled?: boolean;
  /**
   * Accessible name for the checkbox, since it may have no visible label.
   */
  'aria-label'?: string;
  /**
   * Additional classes merged with the checkbox's own classes.
   */
  className?: string;
};

/**
 * Renders a simple controlled checkbox: a native, visually-hidden
 * `<input type="checkbox">` paired with a styled square that shows a check
 * mark when `checked`, similar to Ant Design's `Checkbox`.
 *
 * @param props Checked state, change handler, and disabled/accessibility
 *   options.
 * @returns A styled toggle checkbox element.
 */
export function Checkbox({
  checked,
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
  className,
}: CheckboxProps) {
  return (
    <span className={cn('relative inline-flex h-5 w-5 shrink-0', className)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => onChange(event.target.checked)}
        className="peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none disabled:pointer-events-none disabled:opacity-50"
      />
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors duration-150 peer-disabled:opacity-50',
          checked
            ? 'border-primary bg-primary text-white'
            : 'border-border-strong bg-transparent',
        )}
      >
        {checked && (
          <Check
            size={14}
            strokeWidth={3}
          />
        )}
      </span>
    </span>
  );
}
