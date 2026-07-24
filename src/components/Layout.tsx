import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Store, Calendar, Bell, MessageCircle, User, Shield, BarChart2, HeartHandshake, Briefcase, ShoppingBag, Users, Sun, Moon, PieChart, Heart, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useThemeStore } from '../store/useThemeStore';
import { t } from '../lib/i18n';
import LanguageSelector from './LanguageSelector';
import Notifications from './Notifications';
import LocationSwitcher from './LocationSwitcher';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, updateUser } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const { language } = useLanguageStore();
  const { seniorMode } = useSettingsStore();
  const { theme, toggleTheme } = useThemeStore();

  
  const isGuest = user?.role === 'guest';
  const baseNavItems = [
    { to: '/feed', icon: Home, label: t('nav.feed', language) },
    { to: '/mutual-aid', icon: HeartHandshake, label: t('nav.help', language) },
    { to: '/marketplace', icon: ShoppingBag, label: t('nav.market', language) },
    { to: '/businesses', icon: Store, label: t('nav.businesses', language) },
    { to: '/portrait', icon: PieChart, label: 'Portrait' },
    { to: '/events', icon: Calendar, label: t('nav.events', language) },
    { to: '/polls', icon: BarChart2, label: t('nav.polls', language) },
    { to: '/recommendations', icon: Briefcase, label: t('nav.recommendations', language) },
  ];

  const authNavItems = isGuest ? [] : [
    { to: '/chat', icon: MessageCircle, label: t('nav.chat', language) },
    { to: '/groups', icon: Users, label: 'Groups' },
    { to: '/profile', icon: User, label: t('nav.profile', language) },
  ];

  const navItems = [...baseNavItems, ...authNavItems];


  if (user?.role === 'moderator' || user?.role === 'admin') {
    navItems.push({ to: '/moderator', icon: Shield, label: 'Moderator' });
  }

  return (
    <div className={`mx-auto flex h-screen max-w-md flex-col text-slate-100 sm:max-w-6xl sm:flex-row overflow-hidden sm:rounded-[2rem] sm:my-8 sm:h-[calc(100vh-4rem)] border border-black/10 dark:border-white/10 relative shadow-2xl ${seniorMode ? 'senior-mode' : ''} ${user?.isAnonymous ? 'bg-[#4d6c5b]' : 'bg-transparent'}`}>
      {/* Background glow effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none"></div>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col justify-between border-r border-black/10 dark:border-white/10 glass-panel p-6 sm:flex relative z-10 overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-xl font-bold text-white">Q</div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Qonşu</h1>
          </div>
          
          <nav className="flex flex-col space-y-2 mb-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-xl px-4 py-3 font-medium transition-all ${
                    isActive ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white shadow-inner border border-white/5' : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:bg-white/5 hover:text-slate-900 dark:text-white'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        
        
        <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-4">
          <LocationSwitcher />
          {isGuest && (
            <NavLink to="/auth" className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold transition-colors">
              Sign In / Register
            </NavLink>
          )}
          <LanguageSelector />
        </div>


      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 sm:pb-0 relative z-10">
        {/* Mobile Header */}
        
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-black/10 dark:border-white/10 glass-panel px-4 sm:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 text-lg font-bold text-white">Q</div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Qonşu</h1>
          </div>
          <div className="flex items-center gap-3">
            {isGuest && (
              <NavLink to="/auth" className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg">Sign In</NavLink>
            )}
            <LanguageSelector />
          </div>
        </header>


        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 p-3 flex justify-between items-center text-sm sm:static sm:z-auto sm:bg-transparent sm:border-none sm:px-8 sm:pt-6 sm:pb-0">
          <div className="flex items-center space-x-4">
            {!isGuest && user?.safetyCheckIn?.enabled && (
              <button 
                onClick={() => {
                  updateUser({
                    safetyCheckIn: {
                      enabled: user.safetyCheckIn?.enabled || false,
                      deadlineTime: user.safetyCheckIn?.deadlineTime || '18:00',
                      contactUids: user.safetyCheckIn?.contactUids || [],
                      pendingContactUids: user.safetyCheckIn?.pendingContactUids || [],
                      ...user.safetyCheckIn,
                      lastCheckInDate: new Date().toISOString().split('T')[0]
                    }
                  });
                  // Also update streak if needed, or trigger gamification
                  fetch('/api/gamification/silent-action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUid: user.uid, action: 'daily_login' })
                  }).catch(console.error);
                }}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  user?.safetyCheckIn?.lastCheckInDate === new Date().toISOString().split('T')[0] 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-500 text-white shadow-md shadow-rose-500/20 hover:bg-rose-600 animate-pulse'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{user?.safetyCheckIn?.lastCheckInDate === new Date().toISOString().split('T')[0] ? "Checked In" : "I'm OK"}</span>
              </button>
            )}
            <Notifications />
          </div>

          {/* {t('common.night_mode', language)} switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Night Mode</span>
            <button 
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              title="Toggle Night Mode"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
  
        </div>
        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="glass-panel fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t border-black/10 dark:border-white/10 sm:hidden">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 w-full h-full min-w-[4rem] transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300'
              }`
            }
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center space-y-1 w-full h-full min-w-[4rem] transition-colors text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
          <span className="text-[10px] font-medium truncate w-full text-center">More</span>
        </button>
      </nav>

      {/* Mobile Slide-up Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl overflow-y-auto max-h-[80vh] pb-8 pt-4 px-4 border-t border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <X className="h-6 w-6 text-slate-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-8">
              {navItems.slice(4).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center space-y-2 p-3 rounded-xl transition-colors ${
                      isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`
                  }
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="space-y-4 px-2 border-t border-black/10 dark:border-white/10 pt-6">
              <LocationSwitcher />
              {isGuest && (
                <NavLink to="/auth" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-3 font-semibold transition-colors">
                  Sign In / Register
                </NavLink>
              )}
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
