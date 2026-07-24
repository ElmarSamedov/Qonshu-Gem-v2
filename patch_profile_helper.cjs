const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const importRegex = /import SettingsSection from '.\/profile\/SettingsSection';/;
const importReplacement = `import SettingsSection from './profile/SettingsSection';
import NeighborHelperCard from './profile/NeighborHelperCard';`;
content = content.replace(importRegex, importReplacement);

const jsxRegex = /<SettingsSection \/>/;
const jsxReplacement = `<SettingsSection />
            <NeighborHelperCard />`;
content = content.replace(jsxRegex, jsxReplacement);

fs.writeFileSync('src/components/Profile.tsx', content);
console.log("Patched Profile for helper card");
