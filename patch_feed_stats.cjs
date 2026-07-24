const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

if (!content.includes('trackStatsEvent')) {
  content = content.replace("import { db } from '../lib/firebase';", "import { db } from '../lib/firebase';\nimport { trackStatsEvent } from '../lib/stats';");
}

const resolveRegex = /fetch\('\/api\/stats\/event', \{\n        method: 'POST',\n        headers: \{ 'Content-Type': 'application\/json' \},\n        body: JSON\.stringify\(\{ district: user\.district, event: 'issue_resolved' \}\)\n      \}\)\.catch\(console\.error\);/;
content = content.replace(resolveRegex, "if (user.district) trackStatsEvent(user.district, 'issue_resolved');");

fs.writeFileSync('src/components/Feed.tsx', content);
console.log("Patched Feed.tsx stats");
