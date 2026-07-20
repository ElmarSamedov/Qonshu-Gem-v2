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
import GuestWelcome from './components/GuestWelcome';

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

  // Determine the default route for "/" based on guest status
  const isGuest = user?.role === 'guest';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={isGuest ? <GuestWelcome /> : <Navigate to="/" replace />} />
        <Route path="/auth" element={isGuest ? <AuthScreen /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={isGuest ? <Navigate to="/welcome" replace /> : <Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="mutual-aid" element={<MutualAid />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="businesses" element={<LocalBusinesses />} />
          <Route path="events" element={<CalendarView />} />
          <Route path="polls" element={<Polls />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="chat" element={!isGuest ? <Chat /> : <Navigate to="/auth" replace />} />
          <Route path="groups" element={!isGuest ? <Groups /> : <Navigate to="/auth" replace />} />  
          <Route path="profile" element={!isGuest ? <Profile /> : <Navigate to="/auth" replace />} />
          <Route path="moderator" element={!isGuest ? <ModeratorPanel /> : <Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
