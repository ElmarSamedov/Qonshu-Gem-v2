const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  "'common.free_stuff': 'Free Stuff',",
  "'common.free_stuff': 'Free Stuff',\n    'common.lost_pet': 'Lost Pet',"
);

content = content.replace(
  "'common.free_stuff': 'Pulsuz Əşyalar',",
  "'common.free_stuff': 'Pulsuz Əşyalar',\n    'common.lost_pet': 'İtmiş Ev Heyvanı',"
);

content = content.replace(
  "'common.free_stuff': 'Бесплатные вещи',",
  "'common.free_stuff': 'Бесплатные вещи',\n    'common.lost_pet': 'Потерянный Питомец',"
);

fs.writeFileSync('src/lib/i18n.ts', content);
