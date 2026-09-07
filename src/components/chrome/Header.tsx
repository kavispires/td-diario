import { Title } from '@components/ui/Typography';
import { Bell, Volume2 } from 'lucide-react';
// import { VolumeX } from 'lucide-react'; // Use this when sound is off
import { TDLogoIcon } from '../TDLogoIcon';

export function ChromeHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-slate-50 shadow-md">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <TDLogoIcon className="w-6 h-6 shrink-0" />
          <Title
            level={1}
            className="text-xl text-slate-50"
          >
            TD Diário
          </Title>
        </div>

        {/* Utilities */}
        <div className="flex items-center gap-4">
          {/* Notification Bell with unread dot */}
          <button
            type="button"
            className="relative p-1 active:scale-90 transition-transform"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            className="p-1 active:scale-90 transition-transform"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
