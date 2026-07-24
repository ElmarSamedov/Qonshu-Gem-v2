const fs = require('fs');
let content = fs.readFileSync('src/store/useVerificationStore.ts', 'utf8');
content = content.replace("const { getDoc } = require('firebase/firestore');", "");
fs.writeFileSync('src/store/useVerificationStore.ts', content);
console.log("Fixed useVerificationStore.ts");
