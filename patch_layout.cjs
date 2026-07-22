const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace("Night Mode", "{t('common.night_mode', language)}");

fs.writeFileSync('src/components/Layout.tsx', content);
