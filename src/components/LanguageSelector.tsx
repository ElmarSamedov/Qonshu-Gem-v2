import React from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-slate-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="bg-transparent text-sm font-medium text-slate-700 dark:text-slate-300 border-none outline-none cursor-pointer focus:ring-0"
      >
        <option value="en">EN</option>
        <option value="az">AZ</option>
        <option value="ru">RU</option>
      </select>
    </div>
  );
}
