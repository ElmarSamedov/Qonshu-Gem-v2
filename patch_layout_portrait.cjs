const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace(
  "    { to: '/businesses', icon: Store, label: t('nav.businesses', language) },",
  "    { to: '/businesses', icon: Store, label: t('nav.businesses', language) },\n    { to: '/portrait', icon: Users, label: 'Portrait' },"
);

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout.tsx for portrait");
