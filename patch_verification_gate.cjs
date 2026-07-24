const fs = require('fs');
let content = fs.readFileSync('src/components/VerificationGate.tsx', 'utf8');

const uploadRegex = /const handleUpload = async \(\) => \{[\s\S]*?setUploadStatus\('pending'\);\n    \}, 1500\);\n  \};/;
const uploadReplacement = `const handleUpload = async () => {
    if (!file || !user) return;
    setUploadStatus('uploading');
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Url = e.target?.result;
      await addRequest({
        userId: user.uid,
        name: user.name,
        district: user.district || 'Sabail',
        documentUrl: base64Url,
        locationId: user.activeLocationId || 'loc-home'
      });
      setUploadStatus('pending');
    };
    reader.readAsDataURL(file);
  };`;

content = content.replace(uploadRegex, uploadReplacement);

const postcardRegex = /const handlePostcard = \(\) => \{\n    setUploadStatus\('pending'\); \n  \};/;
const postcardReplacement = `const handlePostcard = async () => {
    if (!user) return;
    setUploadStatus('uploading');
    await addRequest({
      userId: user.uid,
      name: user.name,
      district: user.district || 'Sabail',
      documentUrl: 'https://via.placeholder.com/400x200?text=Postcard+Requested',
      locationId: user.activeLocationId || 'loc-home'
    });
    setUploadStatus('pending');
  };`;

content = content.replace(postcardRegex, postcardReplacement);

fs.writeFileSync('src/components/VerificationGate.tsx', content);
console.log("Patched VerificationGate.tsx");
