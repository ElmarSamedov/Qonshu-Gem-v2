const fs = require('fs');
let content = fs.readFileSync('src/components/StreetMap.tsx', 'utf8');

content = content.replace(
  /style=\{\{ left: \\\`\\\$\{\(x \/ 1000\) \* 100\}%\\\`, top: \\\`\\\$\{\(y \/ 500\) \* 100\}%\\\` \}\}/,
  "style={{ left: `${(x / 1000) * 100}%`, top: `${(y / 500) * 100}%` }}"
);

fs.writeFileSync('src/components/StreetMap.tsx', content);
