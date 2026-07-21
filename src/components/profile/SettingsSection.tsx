import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Bell, AlertTriangle, Store, MessageCircle, Calendar, Globe, Type, Moon, Sun } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useThemeStore } from '../../store/useThemeStore';
import { t } from '../../lib/i18n';

export default function SettingsSection() {
  const { language } = useLanguageStore();
  const { seniorMode, toggleSeniorMode } = useSettingsStore();
  const { theme, toggleTheme } = useThemeStore();

  const [notifications, setNotifications] = useState({
    securityAlerts: true,
    marketplace: true,
    messages: true,
    events: true,
    newNeighbors: true,
    pushEnabled: Notification.permission === 'granted'
  });

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    }
    
    if (Notification.permission === 'granted') {
      setNotifications(prev => ({ ...prev, pushEnabled: true }));
      new Notification('Notifications enabled!', { body: 'You will now receive push alerts.' });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(prev => ({ ...prev, pushEnabled: true }));
        new Notification('Notifications enabled!', { body: 'You will now receive push alerts.' });
      } else {
        setNotifications(prev => ({ ...prev, pushEnabled: false }));
      }
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    if (key === 'pushEnabled' && !notifications.pushEnabled) {
      requestPushPermission();
    } else {
      setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <>
      <Card className="glass-panel border-black/10 dark:border-white/10">
        <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-indigo-400" />
              <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.notif_prefs', language)}</CardTitle>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Control what you get notified about to keep your feed relevant.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toggleNotification('pushEnabled')}
            className={notifications.pushEnabled ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-500' : ''}
          >
            <Bell className="w-4 h-4 mr-2" />
            {notifications.pushEnabled ? 'Push Enabled' : 'Enable Push'}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-black/5 dark:divide-white/5">
            {/* Security Alerts */}
            <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('profile.security_alerts', language)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.security_alerts_desc', language)}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotification('securityAlerts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.securityAlerts ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.securityAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Messages */}
            <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('profile.direct_msgs', language)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.direct_msgs_desc', language)}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotification('messages')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.messages ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.messages ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Marketplace */}
            <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Store className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('profile.market_activity', language)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.market_activity_desc', language)}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotification('marketplace')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.marketplace ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.marketplace ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Events */}
            <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('profile.comm_events', language)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.comm_events_desc', language)}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotification('events')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.events ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.events ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {/* New Neighbors */}
            <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Globe className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('profile.new_neighbors', language) || 'New Neighbors'}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.new_neighbors_desc', language) || 'Alerts when people from your country or with similar interests join nearby'}</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotification('newNeighbors')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.newNeighbors !== false ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.newNeighbors !== false ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-black/10 dark:border-white/10">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2">
            <Type className="h-5 w-5 text-indigo-400" />
            <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.accessibility', language)}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-black/5 dark:divide-white/5">
            <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Type className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('profile.senior', language)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.senior_desc', language)}</p>
                </div>
              </div>
              <button 
                onClick={toggleSeniorMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${seniorMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${seniorMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  {theme === 'dark' ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{t('profile.theme', language)}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.theme_desc', language)}</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
