const fs = require('fs');
let content = fs.readFileSync('src/components/GoodDeedsRegistry.tsx', 'utf8');

const jsxRegex = /\{totalDeeds\} confirmed acts of mutual aid in your district\./;
const jsxReplacement = `This week, neighbors helped each other {totalDeeds} times. Every small act builds our community.`;
content = content.replace(jsxRegex, jsxReplacement);

const titleRegex = /Transparent Registry/;
const titleReplacement = `Neighborhood Contribution`;
content = content.replace(titleRegex, titleReplacement);

fs.writeFileSync('src/components/GoodDeedsRegistry.tsx', content);
console.log("Patched GoodDeedsRegistry");
