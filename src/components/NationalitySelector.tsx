import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useAuthStore } from '../store/useAuthStore';
import { t } from '../lib/i18n';
import nationalitiesData from '../data/nationalities.json';

interface NatNode {
  id: string;
  name_en: string;
  name_ru: string;
  name_az: string;
  level: number;
  parent_id: string | null;
  iso_codes?: string[];
}

export default function NationalitySelector() {
  const { language } = useLanguageStore();
  const { user, updateUser } = useAuthStore();
  
  const [level1, setLevel1] = useState('');
  const [level2, setLevel2] = useState('');
  const [level3, setLevel3] = useState('');
  const [level4, setLevel4] = useState('');

  const [nationalities, setNationalities] = useState<NatNode[]>([]);

  useEffect(() => {
    setNationalities(nationalitiesData as NatNode[]);
  }, []);

  const getOptions = (level: number, parentId: string | null) => {
    return nationalities.filter(n => n.level === level && n.parent_id === parentId);
  };

  const level1Options = getOptions(1, null);
  const level2Options = level1 ? getOptions(2, level1) : [];
  const level3Options = level2 ? getOptions(3, level2) : [];
  const level4Options = level3 ? getOptions(4, level3) : [];

  const getName = (opt: NatNode) => {
    if (language === 'ru') return opt.name_ru || opt.name_en;
    if (language === 'az') return opt.name_az || opt.name_en;
    return opt.name_en;
  };

  const handleSelect = (level: number, val: string) => {
    if (level === 1) {
      setLevel1(val); setLevel2(''); setLevel3(''); setLevel4('');
    } else if (level === 2) {
      setLevel2(val); setLevel3(''); setLevel4('');
    } else if (level === 3) {
      setLevel3(val); setLevel4('');
    } else if (level === 4) {
      setLevel4(val);
    }
    
    if (val) {
      const selectedOpt = nationalities.find(n => n.id === val);
      if (selectedOpt) {
         updateUser({ nationality: getName(selectedOpt) });
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1 block">
          {t('profile.nationality', language) || 'Nationality'}
        </label>
        <div className="space-y-2">
          <select value={level1} onChange={(e) => handleSelect(1, e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white">
             <option value="">{language === 'az' ? 'Region seçin' : language === 'ru' ? 'Выберите регион' : 'Select Region'}</option>
             {level1Options.map(opt => <option key={opt.id} value={opt.id}>{getName(opt)}</option>)}
          </select>
          {level2Options.length > 0 && (
            <select value={level2} onChange={(e) => handleSelect(2, e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white">
               <option value="">{language === 'az' ? 'Qrup seçin' : language === 'ru' ? 'Выберите группу' : 'Select Group'}</option>
               {level2Options.map(opt => <option key={opt.id} value={opt.id}>{getName(opt)}</option>)}
            </select>
          )}
          {level3Options.length > 0 && (
            <select value={level3} onChange={(e) => handleSelect(3, e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white">
               <option value="">{language === 'az' ? 'Xalq seçin' : language === 'ru' ? 'Выберите народ' : 'Select People'}</option>
               {level3Options.map(opt => <option key={opt.id} value={opt.id}>{getName(opt)}</option>)}
            </select>
          )}
          {level4Options.length > 0 && (
            <select value={level4} onChange={(e) => handleSelect(4, e.target.value)} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white">
               <option value="">{language === 'az' ? 'Alt-qrup seçin' : language === 'ru' ? 'Выберите подгруппу' : 'Select Subgroup'}</option>
               {level4Options.map(opt => <option key={opt.id} value={opt.id}>{getName(opt)}</option>)}
            </select>
          )}
        </div>
      </div>
      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800">
         <p className="text-sm font-medium text-slate-900 dark:text-white">
           {language === 'az' ? 'Seçilmiş: ' : language === 'ru' ? 'Выбрано: ' : 'Selected: '} 
           <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">{user?.nationality || 'None'}</span>
         </p>
      </div>
    </div>
  )
}
