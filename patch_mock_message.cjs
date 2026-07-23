const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

content = content.replace(
  "message: \`A new neighbor in \${user.district} shares your interest in \${matches.join(', ')}.\`,",
  "message: \`A new neighbor in \${user.district} shares your interests.\`, interestIds: matches,"
);

content = content.replace(
  "message: \`We found a neighbor in \${user.district} who shares your interest in \${matches.join(', ')}.\`,",
  "message: \`We found a neighbor in \${user.district} who shares your interests.\`, interestIds: matches,"
);

fs.writeFileSync('src/store/useAuthStore.ts', content);
console.log("Updated useAuthStore.ts mock messages");
