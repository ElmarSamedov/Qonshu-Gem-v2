const fs = require('fs');
let content = fs.readFileSync('src/components/Marketplace.tsx', 'utf8');

const regex = /const handleItemClick = \(id: number\) => \{\n    const item = items\.find\(i => i\.id === id\);\n    if \(item\) setSelectedItem\(item\);\n    setItems\(items\.map\(item => item\.id === id \? \{ \.\.\.item, views: item\.views \+ 1 \} : item\)\);\n  \};/;
const replacement = `const handleItemClick = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) setSelectedItem(item);
    if (!user) return;
    setItems(items.map(item => {
      if (item.id === id) {
        const viewedBy = (item as any).viewedBy || [];
        if (!viewedBy.includes(user.uid)) {
          return { ...item, views: item.views + 1, viewedBy: [...viewedBy, user.uid] };
        }
      }
      return item;
    }));
  };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/Marketplace.tsx', content);
console.log("Patched Marketplace.tsx views");
