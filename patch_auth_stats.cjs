const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

content = content.replace("import { triggerGamification } from '../lib/gamification';", "import { triggerGamification } from '../lib/gamification';\nimport { trackStatsEvent } from '../lib/stats';");

const updateInterestsRegex = /fetch\('\/api\/stats\/event', \{\n          method: 'POST',\n          headers: \{ 'Content-Type': 'application\/json' \},\n          body: JSON\.stringify\(\{ district: user\.district, event: 'interests_updated', data: \{ interests: updates\.discoverableInterests \} \}\)\n        \}\)\.catch\(console\.error\);/;
content = content.replace(updateInterestsRegex, "trackStatsEvent(user.district, 'interests_updated', { interests: updates.discoverableInterests });");

const joinRegex = /fetch\('\/api\/stats\/event', \{\n          method: 'POST',\n          headers: \{ 'Content-Type': 'application\/json' \},\n          body: JSON\.stringify\(\{ district, event: 'user_joined', data: \{ verified: false, interests: newUser\.discoverableInterests \|\| \[\] \} \}\)\n        \}\);/;
content = content.replace(joinRegex, "trackStatsEvent(district, 'user_joined', { verified: false, interests: newUser.discoverableInterests || [] });");

const verifyRegex = /fetch\('\/api\/stats\/event', \{\n          method: 'POST',\n          headers: \{ 'Content-Type': 'application\/json' \},\n          body: JSON\.stringify\(\{ district: updatedUser\.district, event: 'user_verified' \}\)\n        \}\)\.catch\(e => console\.error\(e\)\);/;
content = content.replace(verifyRegex, "trackStatsEvent(updatedUser.district, 'user_verified');");

fs.writeFileSync('src/store/useAuthStore.ts', content);
console.log("Patched useAuthStore.ts stats");
