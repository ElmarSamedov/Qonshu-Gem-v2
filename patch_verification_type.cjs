const fs = require('fs');
let content = fs.readFileSync('src/store/useVerificationStore.ts', 'utf8');

content = content.replace(
  "addRequest: (request: Omit<VerificationRequest, 'id' | 'status' | 'date'>) => Promise<void>;",
  "addRequest: (request: Omit<VerificationRequest, 'status' | 'date'> & { id?: string }) => Promise<void>;"
);

fs.writeFileSync('src/store/useVerificationStore.ts', content);
console.log("Patched addRequest type");
