import { DualTranslate } from '@components/ui/DualTranslate';
import { cn } from '@utils/cn';
import { withAlpha } from '@utils/helpers';
import { Check } from 'lucide-react';
import type { HTMLMotionProps } from 'motion/react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import type { GameInfo } from '../../types/puzzles';
import { GameLogos } from './GameLogos';

/**
 * Props accepted by the {@link GameCard} component.
 */
type GameCardProps = HTMLMotionProps<'button'> & {
  /**
   * Game metadata (id, name, tagline, color, release) rendered on the card.
   */
  gameInfo: GameInfo;
  /**
   * Visual size of the card. Defaults to `small`.
   */
  size?: 'large' | 'rectangle' | 'small' | NonEmptyString;
  /**
   * Current state of the game represented by the card. Defaults to
   * `available`.
   */
  state?:
    | 'available'
    | 'in-progress'
    | 'completed'
    | 'disabled'
    | NonEmptyString;
  /**
   * Completion percentage (0 to 100) shown by the progress bar when `state`
   * is `in-progress`.
   */
  progressPercent?: number;
};

/**
 * Renders a clickable card for a single game on the hub screen, showing its
 * logo, name, tagline, and state-specific badges or progress bar.
 *
 * @param props Game metadata, size, state, progress, and native `motion`
 *   button properties.
 * @returns A styled, navigable game card button.
 */
export function GameCard({
  gameInfo,
  size = 'small',
  state = 'available',
  progressPercent = 0,
  className,
  ...props
}: GameCardProps) {
  const navigate = useNavigate();

  // --- 1. SIZING (CSS Grid Spans) ---
  const sizeClasses = {
    large: 'col-span-3 row-span-4 p-5', // e.g., Palavreado
    rectangle: 'col-span-3 row-span-2 p-3', // e.g., Aqui Ó
    small: 'col-span-2 aspect-square p-3', // e.g., UFO, Art
  };

  const sizeClass =
    size in sizeClasses
      ? sizeClasses[size as keyof typeof sizeClasses]
      : sizeClasses.small;

  // --- 2. STATES (Colors & Interactions) ---
  const isCompleted = state === 'completed';
  const isInProgress = state === 'in-progress';
  const isDisabled =
    state === 'disabled' ||
    gameInfo.release === 'disabled' ||
    gameInfo.release === 'soon' ||
    gameInfo.release === 'unreleased';

  // Determine dynamic styles based on state
  const dynamicStyles = {
    backgroundColor: isInProgress
      ? 'var(--color-surface-raised)'
      : isDisabled
        ? 'var(--color-border)'
        : withAlpha(gameInfo.color, 0.85),
    borderColor: isInProgress ? gameInfo.color : 'transparent',
  };

  const stateClasses = isDisabled
    ? 'grayscale opacity-60 cursor-not-allowed shadow-none'
    : 'active:scale-95 hover:shadow-md cursor-pointer shadow-sm';

  const borderClasses = isInProgress ? 'border-2' : 'border-0';

  // --- 3. BADGES (Novo / Breve) ---
  const renderBadge = () => {
    // Priority 1: If it's coming soon
    if (gameInfo.release === 'soon' || gameInfo.release === 'unreleased') {
      return (
        <div className="absolute -top-2 -right-2 bg-foreground text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
          BREVE
        </div>
      );
    }
    // Priority 2: If it's new (and not completed, to avoid clutter)
    if (gameInfo.release === 'demo' || gameInfo.release === 'beta') {
      return (
        <div className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
          NOVO
        </div>
      );
    }
    return null;
  };

  // --- HANDLER ---
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (props.onClick) props.onClick(e);
    else navigate(`/game/${gameInfo.id}`);
  };

  return (
    <motion.button
      layoutId={`game-card-${gameInfo.id}`}
      transition={{
        layout: {
          type: 'spring',
          stiffness: 180,
          damping: 20,
        },
      }}
      onClick={handleClick}
      style={dynamicStyles}
      disabled={isDisabled}
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center rounded-xl transition-all duration-200',
        borderClasses,
        sizeClass,
        stateClasses,
        className,
      )}
      {...props}
    >
      {/* Absolute Badges */}
      {renderBadge()}

      {/* Completed Checkmark */}
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-white text-success p-1 rounded-full shadow-sm">
          <Check
            size={12}
            strokeWidth={4}
          />
        </div>
      )}

      {/* Icon Area */}
      <motion.div
        layoutId={`game-logo-${gameInfo.id}`}
        transition={{
          layout: {
            type: 'spring',
            stiffness: 180,
            damping: 20,
          },
        }}
        className={cn(
          'flex items-center justify-center',
          size === 'large' ? 'mb-3 h-20 w-20' : 'mb-1 h-12 w-12',
        )}
      >
        <GameLogos
          gameId={gameInfo.id}
          className="w-full h-full drop-shadow-sm"
        />
      </motion.div>

      {/* Text Area */}
      <h3
        className={cn(
          'text-center font-bold leading-tight text-foreground',
          size === 'large' ? 'text-lg' : 'text-xs',
        )}
      >
        <DualTranslate>{gameInfo.name}</DualTranslate>
      </h3>

      {size === 'large' && gameInfo.tagline && (
        <p className="text-xs text-foreground text-center mt-1 leading-snug px-2">
          <DualTranslate>{gameInfo.tagline}</DualTranslate>
        </p>
      )}

      {/* Progress Bar (Only visible if in-progress) */}
      {isInProgress && (
        <div className="w-full mt-auto pt-2">
          <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: gameInfo.color,
              }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
}
