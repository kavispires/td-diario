import { AnimatedPage } from '@components/AnimatedPage';
import { ChromeHeader } from '@components/chrome/Header';
import { ChromeNav } from '@components/chrome/Nav';
import { ArchiveScreen } from '@screens/ArchiveScreen';
import { GameScreen } from '@screens/GameScreen';
import { HubScreen } from '@screens/HubScreen';
import { ProfileScreen } from '@screens/ProfileScreen';
import { AnimatePresence } from 'motion/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { MainContent } from './MainContent';

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden">
      <ChromeHeader />

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
              path="/game/:gameId"
              element={
                <AnimatedPage>
                  <GameScreen />
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

      <ChromeNav />
    </div>
  );
}
