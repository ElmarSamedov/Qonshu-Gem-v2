const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const regex = /<div className="relative">\s*<button[\s\S]*?\{showNotifications && \([\s\S]*?<\/div>\s*\)\}\s*<\/div>/;

content = content.replace(regex, '<Notifications />');
fs.writeFileSync('src/components/Layout.tsx', content);
