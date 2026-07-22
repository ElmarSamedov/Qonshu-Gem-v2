const fs = require('fs');
let content = fs.readFileSync('src/components/ModeratorPanel.tsx', 'utf8');

const regexToRemoveScores = /\{report\.aiScores && \(\s*<div className="mt-2 flex gap-3 text-xs">[\s\S]*?<\/div>\s*\)\}/g;
content = content.replace(regexToRemoveScores, '');

fs.writeFileSync('src/components/ModeratorPanel.tsx', content);
