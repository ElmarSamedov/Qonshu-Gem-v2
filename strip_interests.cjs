const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/interests.json', 'utf8'));
const filtered = data.filter(d => d.level !== 'specialization');
fs.writeFileSync('public/interests.json', JSON.stringify(filtered));
console.log("Stripped specializations. New size:", fs.statSync('public/interests.json').size);
