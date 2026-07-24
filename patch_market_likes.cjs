const fs = require('fs');
let content = fs.readFileSync('src/components/Marketplace.tsx', 'utf8');

const regex = /const handleHelpfulClick = \(e: React\.MouseEvent, id: number\) => \{[\s\S]*?\};/;
const replacement = `const handleHelpfulClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!user) return;
    setItems(items.map(item => {
      if (item.id === id) {
        const likedBy = (item as any).likedBy || [];
        if (likedBy.includes(user.uid)) {
          return { ...item, helpful: Math.max(0, item.helpful - 1), likedBy: likedBy.filter((uid: string) => uid !== user.uid) };
        } else {
          return { ...item, helpful: item.helpful + 1, likedBy: [...likedBy, user.uid] };
        }
      }
      return item;
    }));
  };`;

content = content.replace(regex, replacement);

const btnRegex = /<button onClick=\{\(e\) => handleHelpfulClick\(e, item\.id\)\} className="flex items-center hover:text-blue-500 transition-colors">/;
const btnReplacement = `<button onClick={(e) => handleHelpfulClick(e, item.id)} className={\`flex items-center transition-colors \${(item as any).likedBy?.includes(user?.uid) ? 'text-blue-500' : 'hover:text-blue-500'}\`}>`;

content = content.replace(btnRegex, btnReplacement);
fs.writeFileSync('src/components/Marketplace.tsx', content);
console.log("Patched Marketplace.tsx");
