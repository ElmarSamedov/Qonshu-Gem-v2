const fs = require('fs');
let content = fs.readFileSync('src/lib/stats.ts', 'utf8');

const replacement = `            updates['interests.' + interestId] = increment(1);`;

content = content.replace(/updates\[.*\] = increment\(1\);/g, replacement);
fs.writeFileSync('src/lib/stats.ts', content);
