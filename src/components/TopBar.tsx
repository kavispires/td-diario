import { Bell, Volume2 } from 'lucide-react';
// import { VolumeX } from 'lucide-react'; // Use this when sound is off
import tdLogo from '../assets/svg/td.svg';

export function TopBar() {
  return (
    <header className="bg-slate-900 text-slate-50 flex items-center justify-between px-4 py-3 sticky top-0 z-50 shadow-md">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2">
        <img
            src={tdLogo}
            alt=""
            aria-hidden="true"
            className="w-6 h-6 shrink-0"
          />
        <h1 className="text-xl font-bold tracking-wide">TD Diário</h1>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with unread dot */}
        <button className="relative p-1 active:scale-90 transition-transform">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
        </button>

        {/* Sound Toggle */}
        <button className="p-1 active:scale-90 transition-transform">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
