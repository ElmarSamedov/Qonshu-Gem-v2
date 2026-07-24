const fs = require('fs');
let content = fs.readFileSync('src/store/useChatStore.ts', 'utf8');

if (!content.includes("useAuthStore")) {
  content = "import { useAuthStore } from './useAuthStore';\n" + content;
}

content = content.replace(
  "const resolvedSenderId = senderId || 'me';",
  "const resolvedSenderId = senderId || useAuthStore.getState().user?.uid || 'guest';"
);

fs.writeFileSync('src/store/useChatStore.ts', content);
console.log("Patched useChatStore.ts senderId");
