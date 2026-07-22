const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// Replace RegistrySection import
content = content.replace(/import RegistrySection from '.\/profile\/RegistrySection';\n/, '');

// Replace Family & Demographics block
const familyBlockRegex = /<div className="p-6 border-b border-black\/10 dark:border-white\/10">\s*<h3[^>]*>\{t\('profile\.family_demographics'[^}]*\}<\/h3>\s*<div className="space-y-4">\s*<NationalitySelector \/>\s*<\/div>\s*<\/div>/;

content = content.replace(familyBlockRegex, `<div className="p-6 border-b border-black/10 dark:border-white/10">\n              <NationalitySelector />\n            </div>`);

// Replace RegistrySection tag and insert User ID at the end of the Card
content = content.replace(/<BirthdaySettings \/>\n\s*<\/Card>\n\s*<RegistrySection \/>/, `<BirthdaySettings />\n            <div className="p-6 border-t border-black/10 dark:border-white/10">\n              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">User ID</h3>\n              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 flex items-center justify-center border border-slate-200 dark:border-slate-700/50">\n                <code className="font-mono text-sm text-indigo-600 dark:text-indigo-400 break-all select-all font-bold tracking-tight">{user.uid}</code>\n              </div>\n            </div>\n          </Card>`);

fs.writeFileSync('src/components/Profile.tsx', content);
