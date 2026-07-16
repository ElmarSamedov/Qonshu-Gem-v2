const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

// Share
content = content.replace(
  />Share<\/span>/g,
  '>{t(\'common.share\', language)}</span>'
);

// My Neighborhood / My Building
content = content.replace(
  />\s*My Neighborhood\s*<\/button>/g,
  '>{t(\'common.neighborhood\', language)}</button>'
);

content = content.replace(
  />\s*My Building\s*<\/button>/g,
  '>{t(\'common.building\', language)}</button>'
);

// We need to translate post.type.
// Currently it's `post.type.replace('_', ' ')`
// We can use a translation key if it exists, or fallback. Let's do `t(('common.' + post.type) as any, language)`.
content = content.replace(
  /\{post\.type\.replace\('_', ' '\)\}/g,
  "{t(('common.' + post.type) as any, language)}"
);

content = content.replace(
  /\{selectedNeighbor\.type\.replace\('_', ' '\)\}/g,
  "{t(('common.' + selectedNeighbor.type) as any, language)}"
);

// And we need to add 'common.feed', 'common.alert' to the patch... Wait, they are already there?
// 'common.alert': 'Alert' exists.
// 'common.feed' doesn't exist? Actually 'nav.feed' exists. Let's just add 'common.feed': 'Feed'.
// Wait, I will just add these using another script if needed. Let's first check if 'common.feed' exists.

fs.writeFileSync('src/components/Feed.tsx', content);
