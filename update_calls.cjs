const fs = require('fs');

function replaceCall(file, userVar) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file.includes('Recommendations.tsx') && !content.includes('useAuthStore')) {
    content = content.replace("import { useLanguageStore }", "import { useAuthStore } from '../store/useAuthStore';\nimport { useLanguageStore }");
    content = content.replace("export default function Recommendations() {", "export default function Recommendations() {\n  const { user } = useAuthStore();");
  }

  // Find openOrCreateChat(...)
  // We need to replace the first argument with getDeterministicChatId(user?.uid || 'guest', originalFirstArg)
  
  const regex = /openOrCreateChat\(([^,]+),([^,]+),([^)]+)\)/g;
  content = content.replace(regex, (match, arg1, arg2, arg3) => {
    // Only replace if it's not already getDeterministicChatId
    if (arg1.includes('getDeterministicChatId')) return match;
    
    // arg1 could be `neighbor-${notif.matchedUserId}` etc.
    const newArg1 = `getDeterministicChatId(${userVar}?.uid || 'guest', ${arg1.trim()})`;
    return `openOrCreateChat(${newArg1}, ${arg2.trim()}, ${arg3.trim()})`;
  });

  fs.writeFileSync(file, content);
}

replaceCall('src/components/MomentViewer.tsx', 'user');
replaceCall('src/components/LocalBusinesses.tsx', 'user');
replaceCall('src/components/CarNumbers.tsx', 'user');
replaceCall('src/components/Feed.tsx', 'user');
replaceCall('src/components/Marketplace.tsx', 'user');
replaceCall('src/components/MutualAid.tsx', 'user');
replaceCall('src/components/Notifications.tsx', 'user');
replaceCall('src/components/Recommendations.tsx', 'user');
replaceCall('src/components/MarketplaceProductModal.tsx', 'user');

console.log("All openOrCreateChat calls updated");
