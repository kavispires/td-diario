import { Paragraph, Text } from '@components/ui/Typography';
import { Clock } from 'lucide-react';
import flameIcon from '../assets/svg/flame.svg';
import { useDayCountdown } from '../hooks/useDayCountdown';
import { Pill } from './ui/Pill';

export function DailyStatusBoard() {
  const timeLeft = useDayCountdown();
  const { streak, completedCount, totalGames } = {
    streak: 0,
    completedCount: 0,
    totalGames: 0,
  };

  const progressPercent = Math.round((completedCount / totalGames) * 100);

  return (
    <div className="px-4 pt-2 pb-2 flex flex-col gap-2">
      {/* Top Row: Navy Pills */}
      <div className="flex justify-between items-center">
        {/* Streak Pill */}
        <Pill>
          <img
            src={flameIcon}
            alt=""
            aria-hidden="true"
            className="w-4.5 h-4.5 shrink-0"
          />
          <Text className="text-[14px] tracking-wide text-white">
            {streak} {streak === 1 ? 'Dia' : 'Dias'}
          </Text>
        </Pill>

        {/* Timer Pill */}
        <Pill>
          <Clock className="w-4.5 h-4.5 text-slate-200 shrink-0" />

          <Text className="whitespace-nowrap text-[14px] uppercase tracking-wide text-white">
            Termina em{' '}
            <span className="inline-block w-[8ch] text-center font-mono font-semibold tabular-nums">
              {timeLeft || '00:00:00'}
            </span>
          </Text>
        </Pill>
      </div>

      {/* Bottom Row: Progress */}
      <div className="flex flex-col gap-1">
        <Paragraph className="mb-0 text-[15px] text-slate-900">
          <Text
            strong
            className="text-slate-900"
          >
            Progresso:
          </Text>{' '}
          {completedCount} de {totalGames} jogos concluídos
        </Paragraph>

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
