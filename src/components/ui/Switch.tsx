import { cn } from '@utils/cn';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

/**
 * Sizes available for the {@link Switch} component.
 */
type SwitchSize = 'small' | 'default';

/**
 * Props accepted by the {@link Switch} component.
 */
type SwitchProps = {
  /**
   * Controls the checked state externally. When omitted, the switch manages
   * its own checked state.
   */
  checked?: boolean;
  /**
   * Initial checked state when uncontrolled. Defaults to `false`.
   */
  defaultChecked?: boolean;
  /**
   * Called whenever the checked state should change, whether controlled or
   * uncontrolled.
   */
  onChange?: (checked: boolean) => void;
  /**
   * Disables the switch, preventing interaction.
   */
  disabled?: boolean;
  /**
   * Replaces the thumb with a spinner and disables the switch while
   * loading.
   */
  loading?: boolean;
  /**
   * Size of the switch's track and thumb. Defaults to `default`.
   */
  size?: SwitchSize;
  /**
   * Accessible name for the switch, since it has no visible label.
   */
  'aria-label'?: string;
  /**
   * Additional classes merged with the switch's own classes.
   */
  className?: string;
};

const TRACK_SIZE_CLASSES: Record<SwitchSize, string> = {
  small: 'h-4 w-8',
  default: 'h-6 w-11',
};

const THUMB_SIZE_CLASSES: Record<SwitchSize, string> = {
  small: 'h-3 w-3',
  default: 'h-5 w-5',
};

const THUMB_TRANSLATE_CLASSES: Record<SwitchSize, string> = {
  small: 'translate-x-4',
  default: 'translate-x-5',
};

/**
 * Renders a toggle switch for a boolean on/off setting, similar to Ant
 * Design's `Switch` component.
 *
 * @param props Checked state (controlled or uncontrolled), change handler,
 *   size, and disabled/loading flags.
 * @returns A styled toggle switch element.
 */
export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  loading = false,
  size = 'default',
  'aria-label': ariaLabel,
  className,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  function handleClick() {
    const next = !isChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={ariaLabel}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50',
        isChecked ? 'bg-primary' : 'bg-border-strong',
        TRACK_SIZE_CLASSES[size],
        className,
      )}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-full bg-white shadow transition-transform duration-200',
          THUMB_SIZE_CLASSES[size],
          isChecked ? THUMB_TRANSLATE_CLASSES[size] : 'translate-x-0',
        )}
      >
        {loading && (
          <Loader2
            className="h-full w-full animate-spin text-subtle-foreground"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}
