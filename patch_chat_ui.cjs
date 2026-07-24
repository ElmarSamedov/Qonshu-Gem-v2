const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');

if (!content.includes("useAuthStore")) {
  content = "import { useAuthStore } from '../store/useAuthStore';\n" + content;
}

content = content.replace(
  "export default function Chat() {",
  "export default function Chat() {\n  const { user } = useAuthStore();\n  const isMe = (senderId: string) => senderId === user?.uid || senderId === 'me';"
);

content = content.replace(/msg\.senderId === 'me'/g, "isMe(msg.senderId)");

fs.writeFileSync('src/components/Chat.tsx', content);
console.log("Patched Chat.tsx senderId logic");
