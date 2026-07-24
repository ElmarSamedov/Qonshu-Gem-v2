const fs = require('fs');
let content = fs.readFileSync('src/components/profile/MyNeighbors.tsx', 'utf8');

const queryRegex = /const data = docSnap\.data\(\);/;
const queryReplacement = `const data = docSnap.data();
        if (data.quietMode) {
          alert('Neighbor not found or has quiet mode enabled.');
          setIsSearching(false);
          return;
        }`;
content = content.replace(queryRegex, queryReplacement);

fs.writeFileSync('src/components/profile/MyNeighbors.tsx', content);
console.log("Patched MyNeighbors");
