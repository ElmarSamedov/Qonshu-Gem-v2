const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

// Replace {post.author} with an expression
content = content.replace(
  /\{post\.author\}/g,
  '{user?.isAnonymous && (post.author === user?.name || post.author === "You") ? "Anonymous" : post.author}'
);

fs.writeFileSync('src/components/Feed.tsx', content);
