import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto border-x border-slate-200 bg-[#FDFBF7] shadow-2xl relative overflow-hidden">
      <TopBar />

      {/* Main Content Area - flex-1 allows it to grow and push the footer down */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
