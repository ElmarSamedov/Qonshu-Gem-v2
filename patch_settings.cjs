const fs = require('fs');
let content = fs.readFileSync('src/components/profile/SettingsSection.tsx', 'utf8');

const regex = /<div className="p-4 flex items-center justify-between hover:bg-black\/5 dark:bg-white\/5 transition-colors">[\s\S]*?toggleTheme[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(regex, '</div>');

fs.writeFileSync('src/components/profile/SettingsSection.tsx', content);
