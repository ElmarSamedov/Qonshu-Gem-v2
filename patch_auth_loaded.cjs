const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

content = content.replace(
  /set\(\{\n\s*isAuthenticated: true,\n\s*user: \{/g,
  'set({\n            isAuthenticated: true,\n            isAuthLoaded: true,\n            user: {'
);

content = content.replace(
  /set\(\{ user: createGuestUser\(\) \}\);/g,
  'set({ user: createGuestUser(), isAuthenticated: false, isAuthLoaded: true });'
);

fs.writeFileSync('src/store/useAuthStore.ts', content);
console.log("Patched isAuthLoaded");
