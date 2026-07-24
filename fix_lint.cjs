const fs = require('fs');

// Fix VerificationGate.tsx
let vgContent = fs.readFileSync('src/components/VerificationGate.tsx', 'utf8');
vgContent = vgContent.replace(
  /const base64Url = e\.target\?\.result;\n\s*await addRequest\(\{[\s\S]*?\}\);\n\s*setUploadStatus\('pending'\);/,
  `const base64Url = e.target?.result;
      if (typeof base64Url === 'string') {
        await addRequest({
          userId: user.uid,
          name: user.name,
          district: user.district || 'Sabail',
          documentUrl: base64Url,
          locationId: user.activeLocationId || 'loc-home'
        });
        setUploadStatus('pending');
      }`
);
fs.writeFileSync('src/components/VerificationGate.tsx', vgContent);

// Fix useAuthStore.ts
let authContent = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');
authContent = authContent.replace(
  /trackStatsEvent\(updatedUser\.district, 'user_verified'\);/,
  `if (updatedUser.district) trackStatsEvent(updatedUser.district, 'user_verified');`
);
fs.writeFileSync('src/store/useAuthStore.ts', authContent);

console.log("Fixed lint errors");
