const fs = require('fs');
let content = fs.readFileSync('src/store/useVerificationStore.ts', 'utf8');

const regex = /addRequest: async \(req\) => \{\n\s*const newId = 'req-' \+ Date\.now\(\) \+ '-' \+ Math\.floor\(Math\.random\(\) \* 1000\);\n\s*const newRequest: VerificationRequest = \{\n\s*\.\.\.req,\n\s*id: newId,\n\s*status: 'pending',\n\s*date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\]\n\s*\};/;

const replacement = `addRequest: async (req) => {
    const newId = (req as any).id || 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newRequest: VerificationRequest = {
      ...req,
      id: newId,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/store/useVerificationStore.ts', content);
console.log("Patched addRequest ID logic");
