const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const regex = /'trust_scores', 'trust_level'\n\s*\]\)/;
const replacement = `'trust_scores', 'trust_level', 'safetyCheckIn', 'points', 'badges', 'currentStreak', 'lastDailyLoginDate', 'reliabilityScore'\n                      ])`;

content = content.replace(regex, replacement);

fs.writeFileSync('firestore.rules', content);
console.log("Patched keys");
