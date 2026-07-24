const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

// Remove hardcoded email
content = content.replace(
  /\(incoming\(\)\.role == 'user' \|\| \(request\.auth\.token\.email == 'elmar\.myspace@gmail\.com' && incoming\(\)\.role == 'moderator'\)\) &&/,
  "incoming().role == 'user' &&"
);

fs.writeFileSync('firestore.rules', content);
console.log("Patched firestore.rules");
