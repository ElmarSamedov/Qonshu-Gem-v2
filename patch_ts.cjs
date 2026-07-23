const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  "async function sendPushNotification(fcmToken, title, body)",
  "async function sendPushNotification(fcmToken: string, title: string, body: string)"
);
content = content.replace("snapshot.forEach(doc => {", "snapshot.forEach((doc: any) => {");
content = content.replace("await db.runTransaction(async (transaction) => {", "await db.runTransaction(async (transaction: any) => {");
fs.writeFileSync('server.ts', content);
