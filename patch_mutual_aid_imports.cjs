const fs = require('fs');
let content = fs.readFileSync('src/components/MutualAid.tsx', 'utf8');

const newImports = `
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import GoodDeedsRegistry from './GoodDeedsRegistry';
`;

content = content.replace("import { useAuthStore } from '../store/useAuthStore';", "import { useAuthStore } from '../store/useAuthStore';\n" + newImports);

fs.writeFileSync('src/components/MutualAid.tsx', content);
console.log("Patched imports");
