const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  "message: \`A new neighbor in \${district} shares your interest in \${matches.join(', ')}.\`,",
  "message: \`A new neighbor in \${district} shares your interests.\`, interestIds: matches,"
);

content = content.replace(
  "message: \`We found a neighbor in \${district} who shares your interest in \${matches.join(', ')}.\`,",
  "message: \`We found a neighbor in \${district} who shares your interests.\`, interestIds: matches,"
);

content = content.replace(
  "sendPushNotification(neighbor.fcmToken, 'New Neighbor Match!', \`A new neighbor in \${district} shares your interest in \${matches.join(', ')}.\`);",
  "sendPushNotification(neighbor.fcmToken, 'New Neighbor Match!', \`A new neighbor in \${district} shares your interests.\`);"
);

fs.writeFileSync('server.ts', content);
console.log("Updated server.ts notifications");
