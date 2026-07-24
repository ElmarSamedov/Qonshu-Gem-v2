const fs = require('fs');
let content = fs.readFileSync('src/store/useChatStore.ts', 'utf8');

const replacement = `import { create } from 'zustand';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  where
} from 'firebase/firestore';`;

content = content.replace(/^import \{[\s\S]*?\} from 'firebase\/firestore';/, replacement);

fs.writeFileSync('src/store/useChatStore.ts', content);
console.log("Fixed useChatStore.ts imports");
