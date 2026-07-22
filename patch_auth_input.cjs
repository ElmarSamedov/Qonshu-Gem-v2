const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

content = content.replace(/className="bg-white dark:bg-slate-800"/g, 'className="bg-white dark:bg-slate-800 text-black dark:text-black placeholder:text-gray-400 dark:placeholder:text-gray-400"');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
