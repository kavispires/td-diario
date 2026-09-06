import { AnimatedPage } from '@components/AnimatedPage';
import { BottomNav } from '@components/BottomNav';
import { TopBar } from '@components/TopBar';
import { ArchiveScreen } from '@screens/ArchiveScreen';
import { HubScreen } from '@screens/HubScreen';
import { ProfileScreen } from '@screens/ProfileScreen';
import { AnimatePresence } from 'motion/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MainContent } from './MainContent';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <div className="z-20 w-full max-w-md self-center border-x border-slate-200 shadow-2xl">
        <TopBar />
      </div>

      {/*
        overflow-x-hidden prevents horizontal scrollbars
        from appearing while the screens are sliding side-to-side
      */}
      <MainContent>
        {/* mode="wait" ensures the old page finishes exiting before the new one enters */}
        <AnimatePresence mode="wait">
          <Routes
            location={location}
            key={location.pathname}
          >
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
      </MainContent>

      <div className="z-20 w-full max-w-md self-center border-x border-slate-200 shadow-2xl">
        <BottomNav />
      </div>
    </div>
  );
}
