import { DualTranslate } from '@components/ui/DualTranslate';
import { cn } from '@utils/cn';
import { isRecentRelease, withAlpha } from '@utils/helpers';
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
    | 'tried'
    | 'completed'
    | 'disabled'
    | NonEmptyString;
  /**
   * Completion percentage (0 to 100) shown by the progress bar when `state`
   * is `in-progress` or `tried`.
   */
  progressPercent?: number;
  /**
   * Visual treatment of the card. `solid` (default) fills the card with the
   * game's color; `outlined` renders a transparent background with a thick
   * colored border instead, used for idle/available contribution games.
   */
  variant?: 'solid' | 'outlined';
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
  variant = 'solid',
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
  const isTried = state === 'tried';
  const isInProgress = state === 'in-progress' || isTried;
  // Plain "in-progress" renders as a raised white surface with a colored
  // outline; "tried" instead uses the same filled, colored background as
  // "completed" (it's already share-eligible), just with the progress bar
  // still showing underneath.
  const isRaisedSurface = state === 'in-progress';
  const isSoon = gameInfo.release === 'soon';
  const isMaintenance = gameInfo.release === 'maintenance';
  const isDisabled =
    state === 'disabled' ||
    gameInfo.release === 'disabled' ||
    isMaintenance ||
    gameInfo.release === 'unreleased' ||
    isSoon;
  const isOutlined =
    variant === 'outlined' && !isInProgress && !isCompleted && !isDisabled;

  // Absolutely positioned descendants are offset from the ancestor's
  // padding box, so `bottom-3`/`inset-x-3` lines the bar up flush with the
  // `p-3` padding every non-large size uses, instead of adding an extra
  // inset on top of it.
  const progressBarInsetClass = 'inset-x-3 bottom-3';
  // Rectangle cards (e.g. Aqui Ó, Pânico) are short enough that the
  // centered logo/title can overlap the progress bar once it appears, so
  // reserve extra bottom padding only for that size while in progress.
  const inProgressButtonClass =
    isInProgress && size === 'rectangle' ? 'pb-6' : '';

  // Determine dynamic styles based on state
  const dynamicStyles = {
    backgroundColor: isOutlined
      ? withAlpha(gameInfo.color, 0.25)
      : isRaisedSurface
        ? 'var(--color-surface-raised)'
        : isDisabled
          ? 'var(--color-border)'
          : withAlpha(gameInfo.color, 0.85),
    borderColor: isOutlined
      ? gameInfo.color
      : isRaisedSurface
        ? gameInfo.color
        : 'transparent',
  };

  const stateClasses = isSoon
    ? 'opacity-[0.85] cursor-not-allowed shadow-none'
    : isDisabled
      ? 'grayscale opacity-60 cursor-not-allowed shadow-none'
      : 'active:scale-95 hover:shadow-md cursor-pointer shadow-sm';

  const borderClasses = isOutlined
    ? 'border-4'
    : isRaisedSurface
      ? 'border-2'
      : 'border-0';

  // --- 3. BADGES (Teste / Breve / Novo / Manutenção) ---
  const renderBadge = () => {
    // Priority 1: If it's coming soon
    if (isSoon) {
      return (
        <div
          className="absolute -top-2 -left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10"
          style={{ backgroundColor: gameInfo.color }}
        >
          BREVE
        </div>
      );
    }
    // Priority 2: If it's under maintenance
    if (isMaintenance) {
      return (
        <div className="absolute -top-2 -left-2 bg-warning text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
          MANUTENÇÃO
        </div>
      );
    }
    // Priority 3: If it's a test/demo release
    if (gameInfo.release === 'demo') {
      return (
        <div className="absolute -top-2 -left-2 bg-accent text-white text-[10px] font-bold italic px-2 py-0.5 rounded-full shadow-sm z-10">
          TESTE!
        </div>
      );
    }
    // Priority 4: If it's new (beta, or released within the last 21 days)
    if (gameInfo.release === 'beta' || isRecentRelease(gameInfo.releaseDate)) {
      return (
        <div className="absolute -top-2 -left-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
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
        inProgressButtonClass,
        className,
      )}
      {...props}
    >
      {/* Absolute Badges */}
      {renderBadge()}

      {/* Completed Checkmark (also shown for "tried" runs, which are
          already share-eligible even though they're still in progress) */}
      {(isCompleted || isTried) && (
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

      {/* Progress Bar: absolutely positioned so it sits flush with the
          card's own padding instead of participating in the flex centering
          of the logo/title above (see `inProgressButtonClass` for the
          rectangle-only extra bottom padding that keeps it from
          overlapping that centered content). */}
      {isInProgress && (
        <div className={cn('absolute', progressBarInsetClass)}>
          <div
            className={cn(
              'w-full h-1.5 rounded-full overflow-hidden',
              isRaisedSurface ? 'bg-border' : 'bg-white/40',
            )}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: isRaisedSurface ? gameInfo.color : 'white',
              }}
            />
          </div>
        </div>
      )}
    </motion.button>
  );
}
