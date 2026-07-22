const fs = require('fs');
let content = fs.readFileSync('src/components/MarketplaceProductModal.tsx', 'utf8');

content = content.replace(/<\/div>\s*\}\)\s*<Button/g, '<Button');
content = content.replace(/<\/div>\s*\}\)\s*<Button/, '<Button');
content = content.replace(/<\/div>\s*\)\}\s*<Button/g, '<Button');

fs.writeFileSync('src/components/MarketplaceProductModal.tsx', content);
