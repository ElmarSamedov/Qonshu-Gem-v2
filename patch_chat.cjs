const fs = require('fs');
let content = fs.readFileSync('src/components/Chat.tsx', 'utf8');

content = content.replace(
  "import { useChatStore",
  "import { useLanguageStore } from '../store/useLanguageStore';\nimport { t } from '../lib/i18n';\nimport { useChatStore"
);

content = content.replace(
  "const { chats, activeChatId",
  "const { language } = useLanguageStore();\n  const { chats, activeChatId"
);

fs.writeFileSync('src/components/Chat.tsx', content);
