const fs = require('fs');
let content = fs.readFileSync('src/lib/gamification.ts', 'utf8');

const regex = /\/\/ Update local zustand state ONLY \(don't write to firestore to avoid rule failure\)[\s\S]*?useAuthStore\.getState\(\)\.setUser\(\{ \.\.\.user, \.\.\.updates \}\);/;
const replacement = `// Update local zustand state AND firestore since we added rule allowances
      useAuthStore.getState().setUser({ ...user, ...updates });
      
      if (Object.keys(updates).length > 0) {
        import('firebase/firestore').then(({ doc, updateDoc }) => {
          import('./firebase').then(({ db }) => {
            updateDoc(doc(db, 'users', user.uid), updates).catch(console.error);
          });
        });
      }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/lib/gamification.ts', content);
console.log("Patched gamification.ts");
