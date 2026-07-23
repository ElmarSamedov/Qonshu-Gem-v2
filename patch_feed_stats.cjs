const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

content = content.replace(
  "      await setDoc(doc(db, 'posts', newId), newPost);",
  `      await setDoc(doc(db, 'posts', newId), newPost);\n      if (user?.district) {\n        fetch('/api/stats/event', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ district: user.district, event: 'post_published' })\n        }).catch(e => console.error(e));\n      }`
);

fs.writeFileSync('src/components/Feed.tsx', content);
console.log("Patched Feed.tsx for stats");
