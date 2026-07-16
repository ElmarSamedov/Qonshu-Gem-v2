const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

content = content.replace(
  /\{user\?\.isAnonymous && \(post\.author === user\?\.name \|\| post\.author === "You"\) \? "Anonymous" : post\.author\}/g,
  '{post.author}'
);

fs.writeFileSync('src/components/Feed.tsx', content);
