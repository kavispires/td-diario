import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Semantic severity types supported by the {@link Alert} component.
 */
type AlertType = 'success' | 'info' | 'warning' | 'error';

/**
 * Props accepted by the {@link Alert} component.
 */
type AlertProps = {
  /**
   * Severity type, controlling the icon, color, and default semantics.
   * Defaults to `info`.
   */
  type?: AlertType;
  /**
   * Primary alert message.
   */
  message: ReactNode;
  /**
   * Optional supporting detail shown below the message.
   */
  description?: ReactNode;
  /**
   * Shows the severity icon. Defaults to `true`.
   */
  showIcon?: boolean;
  /**
   * Shows a dismiss button. When dismissed, the caller is responsible for
   * unmounting the alert (this component has no internal visibility state).
   */
  closable?: boolean;
  /**
   * Called when the dismiss button is activated.
   */
  onClose?: () => void;
  /**
   * Optional action rendered at the end of the alert, e.g. a retry button.
   */
  action?: ReactNode;
  /**
   * Additional classes merged with the alert's own classes.
   */
  className?: string;
};

const TYPE_ICONS: Record<AlertType, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const TYPE_CLASSES: Record<AlertType, string> = {
  success: 'bg-success/10 border-success/30 text-success',
  info: 'bg-secondary/10 border-secondary/30 text-secondary',
  warning: 'bg-warning/10 border-warning/30 text-warning',
  error: 'bg-destructive/10 border-destructive/30 text-destructive',
};

/**
 * Renders an inline banner communicating success, informational, warning,
 * or error feedback, similar to Ant Design's `Alert` component.
 *
 * @param props Severity type, message content, and optional icon, action,
 *   and dismiss behavior.
 * @returns A styled alert element.
 */
export function Alert({
  type = 'info',
  message,
  description,
  showIcon = true,
  closable = false,
  onClose,
  action,
  className = '',
}: AlertProps) {
  const Icon = TYPE_ICONS[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${TYPE_CLASSES[type]} ${className}`}
    >
      {showIcon && (
        <Icon
          size={20}
          className="mt-0.5 shrink-0"
          aria-hidden="true"
        />
      )}
      <div className="min-w-0 flex-1 text-foreground">
        <p className="text-sm font-semibold">{message}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
      {closable && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="shrink-0 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X
            size={16}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
