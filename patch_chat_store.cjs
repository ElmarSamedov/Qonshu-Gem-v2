const fs = require('fs');
let content = fs.readFileSync('src/store/useChatStore.ts', 'utf8');

const importRegex = /import \{[\s\S]*?\} from 'firebase\/firestore';/;
const importReplacement = `import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  where
} from 'firebase/firestore';`;
content = content.replace(importRegex, importReplacement);

content = content.replace(/initListener: \(\) => \(\) => void;/, 'initListener: (userId: string) => () => void;');
content = content.replace(/initListener: \(\) => \{/, 'initListener: (userId: string) => {');

const onSnapshotRegex = /const unsubscribeChats = onSnapshot\(collection\(db, 'chats'\),/;
const onSnapshotReplacement = `const unsubscribeChats = onSnapshot(query(collection(db, 'chats'), where('participants', 'array-contains', userId)),`;
content = content.replace(onSnapshotRegex, onSnapshotReplacement);

fs.writeFileSync('src/store/useChatStore.ts', content);
console.log("Patched useChatStore.ts");
