const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const importRegex = /import \{ useLanguageStore \} from '\.\.\/store\/useLanguageStore';/;
const importReplacement = `import { useLanguageStore } from '../store/useLanguageStore';
import { useSettingsStore } from '../store/useSettingsStore';`;
content = content.replace(importRegex, importReplacement);

const stateRegex = /const \[apartment, setApartment\] = useState\(''\);/;
const stateReplacement = `const [apartment, setApartment] = useState('');
  const { seniorMode, setSeniorMode } = useSettingsStore();`;
content = content.replace(stateRegex, stateReplacement);

const jsxRegex = /<div className="grid grid-cols-2 gap-3">/;
const jsxReplacement = `<div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Senior Mode</h4>
                        <p className="text-xs text-slate-500">Larger text and simplified interface for better readability.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSeniorMode(!seniorMode)}
                        className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none \${seniorMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}\`}
                      >
                        <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${seniorMode ? 'translate-x-6' : 'translate-x-1'}\`} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/AuthScreen.tsx', content);
console.log("Patched AuthScreen.tsx senior mode");
