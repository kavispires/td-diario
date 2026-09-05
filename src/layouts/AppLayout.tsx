import { AnimatedPage } from '@components/AnimatedPage';
import { BottomNav } from '@components/BottomNav';
import { TopBar } from '@components/TopBar';
import { ArchiveScreen } from '@screens/ArchiveScreen';
import { HubScreen } from '@screens/HubScreen';
import { ProfileScreen } from '@screens/ProfileScreen';
import { AnimatePresence } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto border-x border-slate-200 bg-[#FDFBF7] shadow-2xl relative overflow-hidden">
      <TopBar />

      {/*
        overflow-x-hidden prevents horizontal scrollbars
        from appearing while the screens are sliding side-to-side
      */}
      <main className="flex-1 overflow-x-hidden relative">
        {/* mode="wait" ensures the old page finishes exiting before the new one enters */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <AnimatedPage>
                  <HubScreen />
                </AnimatedPage>
              }
            />
            <Route
              path="/archive"
              element={
                <AnimatedPage>
                  <ArchiveScreen />
                </AnimatedPage>
              }
            />
            <Route
              path="/profile"
              element={
                <AnimatedPage>
                  <ProfileScreen />
                </AnimatedPage>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
