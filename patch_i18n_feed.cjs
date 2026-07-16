const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  "'common.free_stuff': 'Free Stuff',",
  "'common.free_stuff': 'Free Stuff',\n    'common.feed': 'Feed',"
);

content = content.replace(
  "'common.free_stuff': 'Pulsuz Əşyalar',",
  "'common.free_stuff': 'Pulsuz Əşyalar',\n    'common.feed': 'Lent',"
);

content = content.replace(
  "'common.free_stuff': 'Бесплатные вещи',",
  "'common.free_stuff': 'Бесплатные вещи',\n    'common.feed': 'Лента',"
);

fs.writeFileSync('src/lib/i18n.ts', content);
