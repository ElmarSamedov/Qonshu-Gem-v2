const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace("'common.contact': 'Contact',", "'common.contact': 'Contact',\n    'common.visit': 'Visit',");
content = content.replace("'common.contact': 'Əlaqə',", "'common.contact': 'Əlaqə',\n    'common.visit': 'Ziyarət et',");
content = content.replace("'common.contact': 'Связаться',", "'common.contact': 'Связаться',\n    'common.visit': 'Посетить',");

fs.writeFileSync('src/lib/i18n.ts', content);
