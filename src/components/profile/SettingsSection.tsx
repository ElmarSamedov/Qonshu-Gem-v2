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
            </div>
        </CardContent>
      </Card>
    </>
  );
}
