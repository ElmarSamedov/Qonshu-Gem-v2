const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const regex = /\/\/ --- DISTRICT STATS ---/;
const replacement = `// --- PLAYGROUND CHECKINS ---
    match /playground_checkins/{userId} {
      allow read: if isSignedIn();
      allow write: if isSignedIn() && request.auth.uid == userId;
    }
    
    // --- DISTRICT STATS ---`;

content = content.replace(regex, replacement);
fs.writeFileSync('firestore.rules', content);
console.log("Patched firestore.rules with playground_checkins");
