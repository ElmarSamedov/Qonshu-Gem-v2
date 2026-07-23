const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /if \(event === 'user_joined'\) \{[\s\S]*?\} else if \(event === 'user_verified'\) \{/;
const replacement = `if (event === 'user_joined') {
        updates.totalResidents = admin.firestore.FieldValue.increment(1);
        if (data?.verified) {
          updates.verifiedResidents = admin.firestore.FieldValue.increment(1);
        }
        if (data?.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interestId: string) => {
            updates[\`interests.\${interestId}\`] = admin.firestore.FieldValue.increment(1);
          });
        }
      } else if (event === 'interests_updated') {
        if (data?.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interestId: string) => {
            updates[\`interests.\${interestId}\`] = admin.firestore.FieldValue.increment(1);
          });
        }
      } else if (event === 'user_verified') {`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
console.log("Fixed server.ts syntax");
