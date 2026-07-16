const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  "'nav.businesses': 'Businesses',",
  "'nav.businesses': 'Around Me',"
);

content = content.replace(
  "'nav.businesses': 'Bizneslər',",
  "'nav.businesses': 'Ətrafımda',"
);

content = content.replace(
  "'nav.businesses': 'Бизнес',",
  "'nav.businesses': 'Вокруг Меня',"
);

fs.writeFileSync('src/lib/i18n.ts', content);
