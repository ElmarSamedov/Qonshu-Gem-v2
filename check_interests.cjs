const fs = require('fs');
const data = JSON.parse(fs.readFileSync('public/interests.json', 'utf8'));
const counts = {};
data.forEach(d => {
  counts[d.level] = (counts[d.level] || 0) + 1;
});
console.log(counts);
