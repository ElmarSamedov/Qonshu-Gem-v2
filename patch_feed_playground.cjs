const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const importRegex = /import WhatsNearbyWidget from '.\/WhatsNearbyWidget';/;
const importReplacement = `import WhatsNearbyWidget from './WhatsNearbyWidget';
import PlaygroundCheckIn from './PlaygroundCheckIn';`;
content = content.replace(importRegex, importReplacement);

const jsxRegex = /\{\!isGuest && <WhatsNearbyWidget \/>\}/;
const jsxReplacement = `{!isGuest && <WhatsNearbyWidget />}
      {!isGuest && <PlaygroundCheckIn />}`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/Feed.tsx', content);
console.log("Patched Feed for playground");
