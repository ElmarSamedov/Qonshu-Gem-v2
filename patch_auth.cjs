const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

content = content.replace(/<div className="space-y-2">\s*<label className="text-sm font-medium text-slate-700 dark:text-slate-300">Town<\/label>[\s\S]*?<\/div>/, '');

content = content.replace(/grid grid-cols-2 gap-4/, 'grid grid-cols-1 gap-4');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
