const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

const oldKeys = "'name', 'phone', 'avatar', 'nationality', 'birthday', \n                         'allowBirthdayPublic', 'cars', 'interests', 'discoverableInterests', 'locations', \n                         'activeLocationId', 'district', 'address', 'is_verified', \n                         'trust_scores', 'trust_level'";
const newKeys = "'name', 'phone', 'avatar', 'nationality', 'birthday', \n                         'allowBirthdayPublic', 'cars', 'interests', 'discoverableInterests', 'locations', \n                         'activeLocationId', 'district', 'address', 'is_verified', \n                         'trust_scores', 'trust_level', 'safetyCheckIn', 'points', 'badges', 'currentStreak', 'lastDailyLoginDate', 'reliabilityScore'";

content = content.replace(oldKeys, newKeys);

fs.writeFileSync('firestore.rules', content);
console.log("Patched firestore.rules for users");
