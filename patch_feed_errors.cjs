const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

content = content.replace(/setComments\(list\);\n    \}\);/g, "setComments(list);\n    }, (err) => console.error('Comments snapshot error:', err));");
content = content.replace(/setPosts\(postsList\);\n      \}\n    \}\);/g, "setPosts(postsList);\n      }\n    }, (err) => console.error('Posts snapshot error:', err));");
content = content.replace(/setMoments\(momentsList\);\n      \}\n    \}\);/g, "setMoments(momentsList);\n      }\n    }, (err) => console.error('Moments snapshot error:', err));");

fs.writeFileSync('src/components/Feed.tsx', content);
