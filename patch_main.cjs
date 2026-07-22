const fs = require('fs');
let content = fs.readFileSync('src/main.tsx', 'utf8');

const regex = /try\s*\{[\s\S]*?\}\s*catch\s*\(e\)\s*\{\s*console.warn\('Could not patch window\.fetch:',\s*e\);\s*\}/;
content = content.replace(regex, '');

fs.writeFileSync('src/main.tsx', content);
