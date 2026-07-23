const fs = require('fs');
let content = fs.readFileSync('src/components/Recommendations.tsx', 'utf8');

const regex = /const handleConfirm = \(id: number\) => \{[\s\S]*?\};/;
const replacement = `const handleConfirm = (id: number) => {
    setRecommendations(recommendations.map(r => r.id === id ? { ...r, confirmations: r.confirmations + 1 } : r));
    // Simulate sending silent action for the recommended person
    // In a real app, 'targetUid' would be the actual user ID of the recommended person
    fetch('/api/gamification/silent-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUid: 'mock-target-uid', action: 'recommendation_helpful' })
    }).catch(console.error);
  };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/Recommendations.tsx', content);
console.log("Patched Recommendations.tsx");
