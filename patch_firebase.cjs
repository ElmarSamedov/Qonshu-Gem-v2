const fs = require('fs');
let content = fs.readFileSync('src/lib/firebase.ts', 'utf8');

if (!content.includes('getStorage')) {
  content = content.replace("import { getMessaging } from 'firebase/messaging';", "import { getMessaging } from 'firebase/messaging';\nimport { getStorage } from 'firebase/storage';");
  content += "\nexport const storage = getStorage(app);";
  fs.writeFileSync('src/lib/firebase.ts', content);
  console.log("Storage exported");
}
