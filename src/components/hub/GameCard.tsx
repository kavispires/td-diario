import { useAppRuntimeStore } from '@store/useAppRuntimeStore';
import { Check } from 'lucide-react';
import type { HTMLMotionProps } from 'motion/react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import type { GameInfo } from '../../types/puzzles';
import { GameLogos } from './GameLogos';

interface GameCardProps extends HTMLMotionProps<'button'> {
  gameInfo: GameInfo;
  size?: 'large' | 'rectangle' | 'small' | NonEmptyString;
  state?:
    | 'available'
    | 'in-progress'
    | 'completed'
    | 'disabled'
    | NonEmptyString;
  progressPercent?: number; // 0 to 100
}

export function GameCard({
  gameInfo,
  size = 'small',
  state = 'available',
  progressPercent = 0,
  className = '',
  ...props
}: GameCardProps) {
  const navigate = useNavigate();
  const language = useAppRuntimeStore((state) => state.language);

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
    gameInfo.version === 'disabled' ||
    gameInfo.version === 'soon' ||
    gameInfo.version === 'unreleased';

  // Determine dynamic styles based on state
  const dynamicStyles = {
    backgroundColor: isInProgress
      ? '#FFFFFF'
      : isDisabled
        ? '#E2E8F0'
        : gameInfo.color,
    borderColor: isInProgress ? gameInfo.color : 'transparent',
  };

  const stateClasses = isDisabled
    ? 'grayscale opacity-60 cursor-not-allowed shadow-none'
    : 'active:scale-95 hover:shadow-md cursor-pointer shadow-sm';

  const borderClasses = isInProgress ? 'border-2' : 'border-0';

  // --- 3. BADGES (Novo / Breve) ---
  const renderBadge = () => {
    // Priority 1: If it's coming soon
    if (gameInfo.version === 'soon' || gameInfo.version === 'unreleased') {
      return (
        <div className="absolute -top-2 -right-2 bg-slate-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
          BREVE
        </div>
      );
    }
    // Priority 2: If it's new (and not completed, to avoid clutter)
    if (gameInfo.version === 'demo' || gameInfo.version === 'beta') {
      return (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10">
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
    else navigate(gameInfo.id);
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
      className={`relative rounded-xl flex flex-col items-center justify-center transition-all duration-200 w-full h-full ${borderClasses} ${sizeClass} ${stateClasses} ${className}`}
      {...props}
    >
      {/* Absolute Badges */}
      {renderBadge()}

      {/* Completed Checkmark */}
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-slate-900 text-white p-1 rounded-full shadow-sm">
          <Check
            size={12}
            strokeWidth={4}
          />
        </div>
      )}

      {/* Icon Area */}
      <div
        className={`${size === 'large' ? 'w-20 h-20 mb-3' : 'w-12 h-12 mb-1'} flex items-center justify-center`}
      >
        <GameLogos
          gameId={gameInfo.id}
          className="w-full h-full drop-shadow-sm"
        />
      </div>

      {/* Text Area */}
      {/* Note: Assuming 'pt' is the default for DualLanguageValue for now */}
      <h3
        className={`${size === 'large' ? 'text-lg' : 'text-xs'} font-bold text-slate-900 text-center leading-tight`}
      >
        {gameInfo.name[language] || gameInfo.name.pt}
      </h3>

      {size === 'large' && gameInfo.tagline?.[language] && (
        <p className="text-xs text-slate-700 text-center mt-1 leading-snug px-2">
          {gameInfo.tagline[language] || gameInfo.tagline.pt}
        </p>
      )}

      {/* Progress Bar (Only visible if in-progress) */}
      {isInProgress && (
        <div className="w-full mt-auto pt-2">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
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
