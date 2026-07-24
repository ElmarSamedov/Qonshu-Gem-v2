const fs = require('fs');
let content = fs.readFileSync('src/store/useChatStore.ts', 'utf8');

content = content.replace(
  "unread: number;\n  messages: Message[];",
  "unread: number;\n  messages: Message[];\n  participants?: string[];"
);

fs.writeFileSync('src/store/useChatStore.ts', content);
console.log("Patched ChatSession type");
