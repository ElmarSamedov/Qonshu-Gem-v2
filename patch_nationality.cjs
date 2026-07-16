const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// Add import
if (!content.includes('import NationalitySelector')) {
  content = content.replace(
    'import InterestsSelector from "./InterestsSelector";',
    'import InterestsSelector from "./InterestsSelector";\nimport NationalitySelector from "./NationalitySelector";'
  );
}

const search = `              <div className="space-y-1">
                <label className="text-xs text-slate-600 dark:text-slate-400">{t('profile.nationality', language)}</label>
                <input 
                  type="text" 
                  placeholder="e.g. Azerbaijani" 
                  className="w-full bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white"
                  value={user?.nationality || ''}
                  onChange={(e) => updateUser({ nationality: e.target.value })}
                />
              </div>`;

const replace = `              <NationalitySelector />`;

content = content.replace(search, replace);
fs.writeFileSync('src/components/Profile.tsx', content);
