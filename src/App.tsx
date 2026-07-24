import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useChatStore } from './store/useChatStore';
import { useThemeStore } from './store/useThemeStore';
import Layout from './components/Layout';
import DistrictPortrait from './components/DistrictPortrait';
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
import OnboardingWizard from './components/onboarding/OnboardingWizard';

export default function App() {
  const { user, initAuthListener } = useAuthStore();
  const initChatListener = useChatStore((state: any) => state.initListener);
  const { theme } = useThemeStore();

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  useEffect(() => {
    let unsubChats: any;
    if (user && user.role !== 'guest' && user.uid) {
      unsubChats = initChatListener(user.uid);
    }
    return () => {
      if (unsubChats) unsubChats();
    };
  }, [user?.uid, user?.role, initChatListener]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Determine the default route for "/" based on guest status
  const { isAuthenticated, isAuthLoaded } = useAuthStore();
  const isGuest = user?.role === 'guest';
  const hasAccess = isAuthenticated || isGuest;
  
  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={!isAuthenticated ? <GuestWelcome /> : <Navigate to="/" replace />} />
        <Route path="/onboarding" element={!isAuthenticated ? <OnboardingWizard /> : <Navigate to="/" replace />} />
        <Route path="/auth" element={!isAuthenticated ? <AuthScreen /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={hasAccess ? <Layout /> : <Navigate to="/welcome" replace />}>
          <Route index element={isGuest ? <Navigate to="/welcome" replace /> : <Feed />} />
          <Route path="feed" element={<Feed />} />
          <Route path="mutual-aid" element={<MutualAid />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="businesses" element={<LocalBusinesses />} />
          <Route path="portrait" element={<DistrictPortrait />} />
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
