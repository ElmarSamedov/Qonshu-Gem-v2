const fs = require('fs');
let content = fs.readFileSync('src/components/profile/SafetyCheckInSettings.tsx', 'utf8');

content = content.replace("import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';", "import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';");
content = content.replace("import { Label } from '../ui/label';", "");
content = content.replace("import { Switch } from '../ui/switch';", "");

// Fix Switch replacement
const switchTarget = /<Switch[\s\S]*?\/>/;
const switchReplacement = `<button 
            type="button"
            onClick={() => { setEnabled(!enabled); handleSave(); }}
            className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 \${enabled ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}\`}
          >
            <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${enabled ? 'translate-x-6' : 'translate-x-1'}\`} />
          </button>`;
content = content.replace(switchTarget, switchReplacement);

content = content.replace(/<CardDescription/g, "<p");
content = content.replace(/<\/CardDescription>/g, "</p>");
content = content.replace(/<Label/g, "<label");
content = content.replace(/<\/Label>/g, "</label>");

content = content.replace(/variant="secondary"/g, 'variant="outline"');

fs.writeFileSync('src/components/profile/SafetyCheckInSettings.tsx', content);

let layoutContent = fs.readFileSync('src/components/Layout.tsx', 'utf8');
const layoutTarget = `safetyCheckIn: {
                      ...user.safetyCheckIn,
                      lastCheckInDate: new Date().toISOString().split('T')[0]
                    }`;
const layoutReplacement = `safetyCheckIn: {
                      enabled: user.safetyCheckIn?.enabled || false,
                      deadlineTime: user.safetyCheckIn?.deadlineTime || '18:00',
                      contactUids: user.safetyCheckIn?.contactUids || [],
                      pendingContactUids: user.safetyCheckIn?.pendingContactUids || [],
                      ...user.safetyCheckIn,
                      lastCheckInDate: new Date().toISOString().split('T')[0]
                    }`;
layoutContent = layoutContent.replace(layoutTarget, layoutReplacement);
fs.writeFileSync('src/components/Layout.tsx', layoutContent);

console.log("Fixed files");
