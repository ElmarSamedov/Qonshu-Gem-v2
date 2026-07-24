const fs = require('fs');
let content = fs.readFileSync('src/components/ModeratorPanel.tsx', 'utf8');

content = content.replace(/\(\['dashboard', 'verifications', 'reports', 'users'\] as const\)/, "(['dashboard', 'verifications', 'reports'] as const)");
content = content.replace(/\{activeTab === 'users' && \([\s\S]*?\}\)\}/, '');

fs.writeFileSync('src/components/ModeratorPanel.tsx', content);
console.log("Patched ModeratorPanel.tsx");
