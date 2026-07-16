const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace(
  /if \(\!user\?\.isAnonymous\) \{[\s\S]*?\} else \{[\s\S]*?\}/,
  `if (!user?.isAnonymous) {
                if(confirm('Activate Full Anonymity for $5/month?')) {
                  updateUser({ isAnonymous: true, originalName: user?.name, originalAvatar: user?.avatar, name: 'Anonymous', avatar: undefined });
                }
              } else {
                updateUser({ isAnonymous: false, name: user?.originalName || 'New Neighbor', avatar: user?.originalAvatar });
              }`
);

fs.writeFileSync('src/components/Layout.tsx', content);
