const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');
content = content.replace(
  "  points?: number;",
  "  points?: number;\n  reliabilityScore?: number;"
);
fs.writeFileSync('src/store/useAuthStore.ts', content);
