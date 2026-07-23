const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  `        if (data?.interests && Array.isArray(data.interests)) {`,
  `      } else if (event === 'interests_updated') {
        if (data?.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interestId: string) => {
            updates[\`interests.\${interestId}\`] = admin.firestore.FieldValue.increment(1);
          });
        }
      } else if (event === 'user_joined' && data?.interests && Array.isArray(data.interests)) {`
);

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with interests_updated");
