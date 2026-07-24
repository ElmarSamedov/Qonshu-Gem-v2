const fs = require('fs');
let content = fs.readFileSync('src/store/useVerificationStore.ts', 'utf8');

const replacement = `import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { calculateNewTrustScores } from '../lib/trustScores';`;

content = content.replace(/^import \{[\s\S]*?\} from '\.\.\/lib\/trustScores';/, replacement);

fs.writeFileSync('src/store/useVerificationStore.ts', content);
console.log("Restored verification imports");
