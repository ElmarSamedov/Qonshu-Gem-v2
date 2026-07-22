const fs = require('fs');
const content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

const match = content.match(/\{activeMoment && \([\s\S]*?\)\}/);
if (match) {
  fs.writeFileSync('feed_moment.txt', match[0]);
} else {
  console.log('No match');
}
