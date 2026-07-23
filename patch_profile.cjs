const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

content = content.replace("import EmergencyContact from './profile/EmergencyContact';", "import EmergencyContact from './profile/EmergencyContact';\nimport SafetyCheckInSettings from './profile/SafetyCheckInSettings';");
content = content.replace("<EmergencyContact />", "<EmergencyContact />\n            <SafetyCheckInSettings />");

fs.writeFileSync('src/components/Profile.tsx', content);
console.log("Patched Profile.tsx");
