/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import Feed from './components/Feed';
import Marketplace from './components/Marketplace';
import ModeratorPanel from './components/ModeratorPanel';
import Profile from './components/Profile';
import Polls from './components/Polls';
import MutualAid from './components/MutualAid';
import Recommendations from './components/Recommendations';
import CalendarView from './components/CalendarView';
import Groups from './components/Groups';
import LocalBusinesses from './components/LocalBusinesses';
import Chat from './components/Chat';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthScreen />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Feed />} />
          <Route path="mutual-aid" element={<MutualAid />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="businesses" element={<LocalBusinesses />} />
          <Route path="events" element={<CalendarView />} />
          <Route path="polls" element={<Polls />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="chat" element={<Chat />} />
          <Route path="groups" element={<Groups />} />
            <Route path="profile" element={<Profile />} />
          <Route path="moderator" element={<ModeratorPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
