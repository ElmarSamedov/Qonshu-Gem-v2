const fs = require('fs');
let content = fs.readFileSync('src/lib/stats.ts', 'utf8');
content = content.replace(/updates\[\\`interests\.\\\$\{interestId\}\\`\]/g, "updates[`interests.${interestId}`]");
content = content.replace(/updates\[`interests\.\$\{interestId\}`\]/g, "updates[`interests.${interestId}`]");
fs.writeFileSync('src/lib/stats.ts', content);
