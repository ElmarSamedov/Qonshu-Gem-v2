const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(/Marketpleys/g, 'Kiosk');
content = content.replace(/Маркетплейс/g, 'Киоск');

fs.writeFileSync('src/lib/i18n.ts', content);
