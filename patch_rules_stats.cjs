const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const replacement = `// --- REPORTS ---
    match /reports/{reportId} {
      allow read: if isSignedIn() && (isModerator() || isAdmin());
      allow create: if isSignedIn() && incoming().status == 'pending';
      allow update: if isSignedIn() && (isModerator() || isAdmin());
      allow delete: if isAdmin();
    }
    
    // --- DISTRICT STATS ---
    match /district_stats/{districtId} {
      allow read: if true;
      allow write: if isSignedIn();
    }
    
    // --- MUTUAL AID REQUESTS ---
    match /mutual_aid_requests/{requestId} {
      allow read: if true;
      allow write: if isSignedIn();
    }`;

content = content.replace(/\/\/ --- REPORTS ---[\s\S]*?allow delete: if isAdmin\(\);\n    \}/, replacement);
fs.writeFileSync('firestore.rules', content);
console.log("Patched firestore.rules for stats and mutual_aid");
