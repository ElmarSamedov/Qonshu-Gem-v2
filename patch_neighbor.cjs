const fs = require('fs');

const files = [
  'src/components/Feed.tsx',
  'src/components/profile/MyNeighbors.tsx',
  'src/components/Chat.tsx',
  'src/components/MutualAid.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/'Neighbor'/g, "t('common.neighbor', language)");
    content = content.replace(/'Anonymous Neighbor'/g, "t('common.neighbor', language)");
    
    fs.writeFileSync(file, content);
  }
}
