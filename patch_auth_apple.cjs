const fs = require('fs');
let content = fs.readFileSync('src/components/AuthScreen.tsx', 'utf8');

const appleRegex = /<Button type="button" variant="outline" onClick=\{\(\) => handleSocialLogin\('Apple'\)\}.*?>Apple<\/Button>\s*<\/div>/;
content = content.replace(appleRegex, '</div>');
content = content.replace(/<div className="grid grid-cols-2 gap-3">/, '<div className="grid grid-cols-1 gap-3">');

fs.writeFileSync('src/components/AuthScreen.tsx', content);
console.log("Patched AuthScreen.tsx");
