const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const regex = /\/\/ --- DISTRICT STATS ---/;
const replacement = `// --- GOOD DEEDS ---
    match /good_deeds/{deedId} {
      allow read: if true;
      allow create: if isSignedIn();
    }
    
    // --- DISTRICT STATS ---`;

content = content.replace(regex, replacement);
fs.writeFileSync('firestore.rules', content);
console.log("Patched firestore.rules with good_deeds");
