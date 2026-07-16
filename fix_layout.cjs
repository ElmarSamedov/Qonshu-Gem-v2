const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const search = `            <div className="flex items-center space-x-2 border-l border-black/10 dark:border-white/10 pl-4">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{t('layout.ghost_mode', language)}</span>
            </div>`;
const replace = search + '\\n          </div>';

content = content.replace(search, replace);
fs.writeFileSync('src/components/Layout.tsx', content);
