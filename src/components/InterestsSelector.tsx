import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';

interface InterestNode {
  id: string;
  parent_id: string | null;
  interest_en: string;
  interest_ru: string;
  interest_az: string;
  level: string;
}

interface InterestsSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function InterestsSelector({ selectedIds, onChange }: InterestsSelectorProps) {
  const { language } = useLanguageStore();
  
  const [selectedLevel1, setSelectedLevel1] = useState('');
  const [selectedLevel2, setSelectedLevel2] = useState('');
  const [selectedLevel3, setSelectedLevel3] = useState('');
  const [selectedLevel4, setSelectedLevel4] = useState('');
  
  const [interests, setInterests] = useState<InterestNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/interests.json')
      .then(res => res.json())
      .then(data => {
        setInterests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load interests', err);
        setLoading(false);
      });
  }, []);

  const handleAddInterest = () => {
    const interestId = selectedLevel4 || selectedLevel3 || selectedLevel2 || selectedLevel1;
    if (interestId) {
      if (!selectedIds.includes(interestId)) {
        onChange([...selectedIds, interestId]);
      }
      // Reset selections
      setSelectedLevel1('');
      setSelectedLevel2('');
      setSelectedLevel3('');
      setSelectedLevel4('');
    }
  };

  const getOptions = (level: string, parentId: string | null) => {
    return interests.filter(i => i.level === level && i.parent_id === parentId);
  };

  const getName = (opt: InterestNode | undefined) => {
    if (!opt) return '';
    if (language === 'ru') return opt.interest_ru || opt.interest_en;
    if (language === 'az') return opt.interest_az || opt.interest_en;
    return opt.interest_en;
  };

  const level1Options = getOptions('interest', null);
  const level2Options = selectedLevel1 ? getOptions('subcategory', selectedLevel1) : [];
  const level3Options = selectedLevel2 ? getOptions('refinement', selectedLevel2) : [];
  const level4Options = selectedLevel3 ? getOptions('specialization', selectedLevel3) : [];

  if (loading) {
    return <div className="text-sm text-slate-500">Loading interests...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1 block">
          {language === 'az' ? 'Kateqoriya' : language === 'ru' ? 'Категория' : 'Category'}
        </label>
        <select
          value={selectedLevel1}
          onChange={(e) => {
            setSelectedLevel1(e.target.value);
            setSelectedLevel2('');
            setSelectedLevel3('');
            setSelectedLevel4('');
          }}
          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white"
        >
          <option value="">{language === 'az' ? 'Seçin...' : language === 'ru' ? 'Выберите...' : 'Select...'}</option>
          {level1Options.map(opt => (
            <option key={opt.id} value={opt.id}>{getName(opt)}</option>
          ))}
        </select>
      </div>

      {level2Options.length > 0 && (
        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1 block">
            {language === 'az' ? 'Alt kateqoriya' : language === 'ru' ? 'Подкатегория' : 'Subcategory'}
          </label>
          <select
            value={selectedLevel2}
            onChange={(e) => {
              setSelectedLevel2(e.target.value);
              setSelectedLevel3('');
              setSelectedLevel4('');
            }}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white"
          >
            <option value="">{language === 'az' ? 'Seçin...' : language === 'ru' ? 'Выберите...' : 'Select...'}</option>
            {level2Options.map(opt => (
              <option key={opt.id} value={opt.id}>{getName(opt)}</option>
            ))}
          </select>
        </div>
      )}

      {level3Options.length > 0 && (
        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1 block">
            {language === 'az' ? 'Dəqiqləşdirmə' : language === 'ru' ? 'Уточнение' : 'Refinement'}
          </label>
          <select
            value={selectedLevel3}
            onChange={(e) => {
              setSelectedLevel3(e.target.value);
              setSelectedLevel4('');
            }}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white"
          >
            <option value="">{language === 'az' ? 'Seçin...' : language === 'ru' ? 'Выберите...' : 'Select...'}</option>
            {level3Options.map(opt => (
              <option key={opt.id} value={opt.id}>{getName(opt)}</option>
            ))}
          </select>
        </div>
      )}

      {level4Options.length > 0 && (
        <div>
          <label className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1 block">
            {language === 'az' ? 'İxtisaslaşma' : language === 'ru' ? 'Специализация' : 'Specialization'}
          </label>
          <select
            value={selectedLevel4}
            onChange={(e) => setSelectedLevel4(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-900 dark:text-white"
          >
            <option value="">{language === 'az' ? 'Seçin...' : language === 'ru' ? 'Выберите...' : 'Select...'}</option>
            {level4Options.map(opt => (
              <option key={opt.id} value={opt.id}>{getName(opt)}</option>
            ))}
          </select>
        </div>
      )}

      {selectedLevel1 && (
        <div className="pt-2 flex justify-end">
          <button 
            type="button"
            onClick={handleAddInterest}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {language === 'az' ? 'Əlavə et' : language === 'ru' ? 'Добавить' : 'Add Interest'}
          </button>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
            {language === 'az' ? 'Sizin maraqlarınız' : language === 'ru' ? 'Ваши интересы' : 'Your Interests'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedIds.map(id => {
              const interest = interests.find(i => i.id === id);
              if (!interest) return null;
              return (
                <div key={id} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium flex items-center gap-2 border border-indigo-100 dark:border-indigo-800">
                  {getName(interest)}
                  <button 
                    type="button"
                    onClick={() => onChange(selectedIds.filter(i => i !== id))}
                    className="hover:text-indigo-900 dark:hover:text-indigo-100 font-bold ml-1"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
