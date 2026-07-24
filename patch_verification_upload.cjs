const fs = require('fs');
let content = fs.readFileSync('src/components/VerificationGate.tsx', 'utf8');

if (!content.includes('import { storage } from')) {
  content = content.replace("import { useAuthStore } from '../store/useAuthStore';", "import { useAuthStore } from '../store/useAuthStore';\nimport { storage } from '../lib/firebase';\nimport { ref, uploadBytes, getDownloadURL } from 'firebase/storage';");
}

const oldUpload = `const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      await addRequest({
        userId: user.uid,
        name: user.name,
        district: user.district || 'Sabail',
        documentUrl: data.url,
        locationId: user.activeLocationId || 'loc-home'
      });`;

const newUpload = `const requestId = 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const storageRef = ref(storage, \`verification_docs/\${user.uid}/\${requestId}.jpg\`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      await addRequest({
        id: requestId,
        userId: user.uid,
        name: user.name,
        district: user.district || 'Sabail',
        documentUrl: downloadUrl,
        locationId: user.activeLocationId || 'loc-home'
      });`;

content = content.replace(oldUpload, newUpload);
fs.writeFileSync('src/components/VerificationGate.tsx', content);
console.log("Patched VerificationGate");
