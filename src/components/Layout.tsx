import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Store, Calendar, Bell, MessageCircle, User, Shield, BarChart2, HeartHandshake, Briefcase, ShoppingBag, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { t } from '../lib/i18n';
import LanguageSelector from './LanguageSelector';

export default function Layout() {
  const { user, updateUser } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userNationality = user?.nationality || 'Azerbaijani';
  
  const simulatedNotifications = [
    {
      id: 1,
      title: 'New Neighbor Alert',
      message: `A person of your nationality (${userNationality}) just joined the neighborhood. They are 45 meters away from you.`,
      time: '2 mins ago',
      unread: true
    },
    {
      id: 2,
      title: 'Marketplace Update',
      message: 'Someone is interested in your listing.',
      time: '1 hour ago',
      unread: false
    }
  ];
  const { language } = useLanguageStore();
  const { seniorMode } = useSettingsStore();

  const navItems = [
    { to: '/', icon: Home, label: t('nav.feed', language) },
    { to: '/mutual-aid', icon: HeartHandshake, label: t('nav.help', language) },
    { to: '/marketplace', icon: ShoppingBag, label: t('nav.market', language) },
    { to: '/businesses', icon: Store, label: t('nav.businesses', language) },
    { to: '/events', icon: Calendar, label: t('nav.events', language) },
    { to: '/polls', icon: BarChart2, label: t('nav.polls', language) },
    { to: '/recommendations', icon: Briefcase, label: t('nav.recommendations', language) },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat', language) },
    { to: '/groups', icon: Users, label: 'Groups' },
    { to: '/profile', icon: User, label: t('nav.profile', language) },
  ];

  if (user?.role === 'moderator' || user?.role === 'admin') {
    navItems.push({ to: '/moderator', icon: Shield, label: 'Moderator' });
  }

  return (
    <div className={`mx-auto flex h-screen max-w-md flex-col text-slate-100 sm:max-w-4xl sm:flex-row overflow-hidden sm:rounded-[2rem] sm:my-8 sm:h-[calc(100vh-4rem)] border border-black/10 dark:border-white/10 relative shadow-2xl ${seniorMode ? 'senior-mode' : ''} ${user?.isAnonymous ? 'bg-[#4d6c5b]' : 'bg-transparent'}`}>
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
        
        <div className="pt-4 border-t border-black/10 dark:border-white/10">
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
          <LanguageSelector />
        </header>

        <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 p-3 flex justify-between items-center text-sm sm:static sm:z-auto sm:bg-transparent sm:border-none sm:px-8 sm:pt-6 sm:pb-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden z-50">
                  <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">Mark all as read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {simulatedNotifications.map(notif => (
                      <div key={notif.id} className={`p-4 border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`text-sm font-semibold ${notif.unread ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>{notif.title}</h4>
                          <span className="text-xs text-slate-500">{notif.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 border-l border-black/10 dark:border-white/10 pl-4">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{t('layout.ghost_mode', language)}</span>
            </div>
          </div>
          
            <button 
              onClick={() => {
                if (!user?.isAnonymous) {
                  setShowPaymentModal(true);
                } else {
                  updateUser({ isAnonymous: false, name: user?.originalName || 'New Neighbor', avatar: user?.originalAvatar });
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${user?.isAnonymous ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${user?.isAnonymous ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>

            {showPaymentModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-black/10 dark:border-white/10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('layout.activate_ghost', language)}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t('layout.ghost_mode_desc', language)}</p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{t('layout.total', language)}</span>
                        <span className="font-bold text-xl text-slate-900 dark:text-white">$5.00<span className="text-sm text-slate-500">/mo</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
                    >{t('layout.cancel', language)}</button>
                    <button 
                      onClick={() => {
                        updateUser({ isAnonymous: true, originalName: user?.name, originalAvatar: user?.avatar, name: 'Anonymous', avatar: undefined });
                        setShowPaymentModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                    >{t('layout.pay_activate', language)}</button>
                  </div>
                </div>
              </div>
            )}
  
        </div>
        <div className="p-4 sm:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="glass-panel fixed bottom-0 left-0 right-0 z-20 flex h-16 items-center justify-around border-t border-black/10 dark:border-white/10 sm:hidden overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
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
      </nav>
    </div>
  );
}
