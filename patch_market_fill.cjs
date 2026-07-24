const fs = require('fs');
let content = fs.readFileSync('src/components/Marketplace.tsx', 'utf8');

const regex = /<ThumbsUp className="h-3 w-3 mr-1"\/>/g;
const replacement = `<ThumbsUp className={\`h-3 w-3 mr-1 \${(item as any).likedBy?.includes(user?.uid) ? 'fill-current' : ''}\`}/>`;
content = content.replace(regex, replacement);

fs.writeFileSync('src/components/Marketplace.tsx', content);
console.log("Patched Marketplace fill");
