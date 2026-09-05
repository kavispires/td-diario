import { Clock } from 'lucide-react';
import { useDayCountdown } from '../hooks/useDayCountdown';
import { useDailyStore } from '../store/useDailyStore';
import flameIcon from '../assets/svg/flame.svg';

export function DailyStatusBoard() {
  const timeLeft = useDayCountdown();
  const { streak, completedCount, totalGames } = useDailyStore();

  const progressPercent = Math.round((completedCount / totalGames) * 100);

  return (
    <div className="px-4 pt-2 pb-2 flex flex-col gap-2">
      {/* Top Row: Navy Pills */}
      <div className="flex justify-between items-center">
        {/* Streak Pill */}
        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
          <img
            src={flameIcon}
            alt=""
            aria-hidden="true"
            className="w-4.5 h-4.5 shrink-0"
          />
          <span className="text-[14px] font-normal tracking-wide">
            {streak} {streak === 1 ? 'Dia' : 'Dias'}
          </span>
        </div>

        {/* Timer Pill */}
        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-md">
          <Clock className="w-4.5 h-4.5 text-slate-200 shrink-0" />

          <span className="text-[14px] font-normal racking-wide uppercase whitespace-nowrap">
            Próximos em{' '}
            <span className="inline-block w-[8ch] text-center font-mono font-semibold tabular-nums">
              {timeLeft || '00:00:00'}
            </span>
          </span>
        </div>
      </div>

      {/* Bottom Row: Progress */}
      <div className="flex flex-col gap-2 ">
        <p className="text-[15px] text-slate-900">
          <span className="font-bold">Progresso:</span> {completedCount} de {totalGames} jogos concluídos
        </p>

        {/*
          Progress Track
          Using p-0.5 creates that "inner fill" look seen in the screenshot
        */}
        <div className="w-full h-3 bg-slate-900 rounded-full p-0.5 shadow-sm">
          {/* Progress Fill */}
          <div
            className="h-full bg-[#77B28C] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
