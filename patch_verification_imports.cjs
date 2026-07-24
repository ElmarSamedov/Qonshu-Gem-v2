const fs = require('fs');
let content = fs.readFileSync('src/store/useVerificationStore.ts', 'utf8');

const importRegex = /import \{[\s\S]*?\} from 'firebase\/firestore';/;
const importReplacement = `import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { calculateNewTrustScores } from '../lib/trustScores';`;
content = content.replace(importRegex, importReplacement);

fs.writeFileSync('src/store/useVerificationStore.ts', content);
console.log("Patched verification imports");
