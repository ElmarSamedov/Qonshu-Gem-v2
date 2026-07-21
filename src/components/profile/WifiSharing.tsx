import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Wifi, Check, X } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { t } from '../../lib/i18n';

export default function WifiSharing() {
  const { language } = useLanguageStore();
  const [showWifiToNeighbors, setShowWifiToNeighbors] = useState(true);
  const [isEditingRouter, setIsEditingRouter] = useState(false);
  const [wifiSsid, setWifiSsid] = useState('MyWiFi_Guest');
  const [wifiPassword, setWifiPassword] = useState('qonsu123');
  const [routerCode, setRouterCode] = useState('MyWiFi_Guest / Pass: qonsu123');

  return (
    <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
            <Wifi className="h-4 w-4 mr-2 text-indigo-500" /> {t('profile.guest_wifi' as any, language) || 'Guest Wi-Fi'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{t('profile.guest_wifi_desc' as any, language) || 'Share your guest network details with neighbors.'}</p>
        </div>
        <button 
          onClick={() => setShowWifiToNeighbors(!showWifiToNeighbors)}
          className={`w-12 h-6 rounded-full transition-colors relative ${showWifiToNeighbors ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${showWifiToNeighbors ? 'left-7' : 'left-1'}`}></div>
        </button>
      </div>

      {showWifiToNeighbors && (
        <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10">
          {isEditingRouter ? (
            <div className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500">Network Name (SSID)</label>
                <input 
                  type="text" 
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white mt-1"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500">Password</label>
                <input 
                  type="text" 
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button size="sm" variant="ghost" onClick={() => setIsEditingRouter(false)} className="h-7 text-xs">Cancel</Button>
                <Button size="sm" onClick={() => {
                  setRouterCode(`${wifiSsid} / Pass: ${wifiPassword}`);
                  setIsEditingRouter(false);
                }} className="h-7 text-xs bg-indigo-600 text-white">Save details</Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <code className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all">{routerCode}</code>
              <Button size="sm" variant="ghost" onClick={() => setIsEditingRouter(true)} className="h-7 text-xs text-indigo-500">Edit</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
