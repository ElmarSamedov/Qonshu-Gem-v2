const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const importRegex = /import NeighborhoodPulse from '.\/NeighborhoodPulse';/;
const importReplacement = `import NeighborhoodPulse from './NeighborhoodPulse';
import WhatsNearbyWidget from './WhatsNearbyWidget';`;
content = content.replace(importRegex, importReplacement);

const jsxRegex = /\{\!isGuest && <NeighborhoodPulse \/>\}/;
const jsxReplacement = `{!isGuest && <WhatsNearbyWidget />}
      {!isGuest && <NeighborhoodPulse />}`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/Feed.tsx', content);
console.log("Patched Feed for widget");
