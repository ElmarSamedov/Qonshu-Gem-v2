const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

content = content.replace(
  'isAnonymous?: boolean;',
  'isAnonymous?: boolean;\n  originalName?: string;\n  originalAvatar?: string;'
);

fs.writeFileSync('src/store/useAuthStore.ts', content);
