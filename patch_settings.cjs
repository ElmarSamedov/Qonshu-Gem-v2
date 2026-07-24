const fs = require('fs');
let content = fs.readFileSync('src/components/profile/SettingsSection.tsx', 'utf8');

const importRegex = /import \{ useThemeStore \} from '\.\.\/\.\.\/store\/useThemeStore';/;
const importReplacement = `import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Ghost, Download } from 'lucide-react';`;
content = content.replace(importRegex, importReplacement);

const stateRegex = /const \{ theme, toggleTheme \} = useThemeStore\(\);/;
const stateReplacement = `const { theme, toggleTheme } = useThemeStore();
  const { user, updateUser } = useAuthStore();
  
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "my_qonsu_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };`;
content = content.replace(stateRegex, stateReplacement);

const jsxRegex = /<Card className="glass-panel border-black\/10 dark:border-white\/10 mt-6">/;
const jsxReplacement = `
<Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg shrink-0">
                  <Ghost className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Quiet Mode</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Hide from "My Neighbors" directory and disable non-critical alerts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateUser({ quietMode: !user?.quietMode })}
                className={\`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none \${user?.quietMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}\`}
              >
                <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${user?.quietMode ? 'translate-x-6' : 'translate-x-1'}\`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg shrink-0">
                  <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Export My Data</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Download a copy of your profile and data history as a JSON file.
                  </p>
                </div>
              </div>
              <Button onClick={handleExportData} variant="outline" className="shrink-0 bg-white dark:bg-slate-900">
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/profile/SettingsSection.tsx', content);
console.log("Patched SettingsSection");
