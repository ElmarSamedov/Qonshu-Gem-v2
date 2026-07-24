const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/useChatStore\(state => state\.initListener\);/, 'useChatStore((state: any) => state.initListener);');
fs.writeFileSync('src/App.tsx', content);
