const fs = require('fs');
let content = fs.readFileSync('src/components/ModeratorPanel.tsx', 'utf8');

const oldFilter = `const filteredPendingReports = reports
          .filter(r => r.status === 'pending')
          ;`;

const newFilter = `const filteredPendingReports = reports
          .filter(r => r.status === 'pending')
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());`;

content = content.replace(oldFilter, newFilter);

fs.writeFileSync('src/components/ModeratorPanel.tsx', content);
