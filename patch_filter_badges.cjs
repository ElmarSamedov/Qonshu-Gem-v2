const fs = require('fs');
let content = fs.readFileSync('src/components/profile/GamificationCard.tsx', 'utf8');

const regex = /\{badges\.map\(badgeId => \{/;
const replacement = `{badges.filter(b => !b.startsWith('trusted_')).map(badgeId => {`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/profile/GamificationCard.tsx', content);
console.log("Patched GamificationCard.tsx to filter out trusted badges");
