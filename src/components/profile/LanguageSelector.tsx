import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { t } from '../../lib/i18n';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.language', language)}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <button 
          onClick={() => setLanguage('en')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${language === 'en' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:bg-white/5 border border-transparent'}`}
        >
          English
        </button>
        <button 
          onClick={() => setLanguage('az')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${language === 'az' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:bg-white/5 border border-transparent'}`}
        >
          Azərbaycan
        </button>
        <button 
          onClick={() => setLanguage('ru')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${language === 'ru' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:bg-white/5 border border-transparent'}`}
        >
          Русский
        </button>
      </CardContent>
    </Card>
  );
}
