const fs = require('fs');
let content = fs.readFileSync('src/store/useVerificationStore.ts', 'utf8');

const approveRegex = /approveRequest: async \(id\) => \{[\s\S]*?\}\n  \},/;
const approveReplacement = `approveRequest: async (id) => {
    try {
      const response = await fetch('/api/verification/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id })
      });
      if (!response.ok) {
        throw new Error('Failed to approve request via API');
      }
    } catch (e) {
      console.error('Failed to approve verification request:', e);
    }
  },`;

content = content.replace(approveRegex, approveReplacement);

const rejectRegex = /rejectRequest: async \(id\) => \{[\s\S]*?\}\n  \},/;
const rejectReplacement = `rejectRequest: async (id) => {
    try {
      const response = await fetch('/api/verification/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id })
      });
      if (!response.ok) {
        throw new Error('Failed to reject request via API');
      }
    } catch (e) {
      console.error('Failed to reject verification request:', e);
    }
  },`;
  
content = content.replace(rejectRegex, rejectReplacement);

fs.writeFileSync('src/store/useVerificationStore.ts', content);
console.log("Updated useVerificationStore");
