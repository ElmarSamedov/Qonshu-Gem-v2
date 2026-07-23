const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

content = content.replace(
  `body: JSON.stringify({ district: user.district, event: 'user_joined', data: { interests: updates.discoverableInterests } })`,
  `body: JSON.stringify({ district: user.district, event: 'interests_updated', data: { interests: updates.discoverableInterests } })`
);

fs.writeFileSync('src/store/useAuthStore.ts', content);
console.log("Patched useAuthStore.ts to use interests_updated");
