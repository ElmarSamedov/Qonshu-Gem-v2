const fs = require('fs');

const filesToPatch = [
  'src/components/MomentViewer.tsx',
  'src/components/LocalBusinesses.tsx',
  'src/components/CarNumbers.tsx',
  'src/components/Feed.tsx',
  'src/components/Marketplace.tsx',
  'src/components/MutualAid.tsx',
  'src/components/Notifications.tsx',
  'src/components/Recommendations.tsx',
  'src/components/MarketplaceProductModal.tsx'
];

filesToPatch.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes("getDeterministicChatId")) {
    content = "import { getDeterministicChatId } from '../lib/chatUtils';\n" + content;
  }
  fs.writeFileSync(file, content);
});
console.log("Imports added");
