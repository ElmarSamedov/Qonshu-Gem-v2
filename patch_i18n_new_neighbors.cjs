const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  "'profile.accessibility': 'Accessibility',",
  "'profile.accessibility': 'Accessibility',\n    'profile.new_neighbors': 'New Neighbors & Demographics',\n    'profile.new_neighbors_desc': 'Alerts when people from your country or with similar interests join nearby',"
);

content = content.replace(
  "'profile.accessibility': 'Əlçatanlıq',",
  "'profile.accessibility': 'Əlçatanlıq',\n    'profile.new_neighbors': 'Yeni Qonşular və Demoqrafiya',\n    'profile.new_neighbors_desc': 'Ölkənizdən olan və ya bənzər maraqları olan şəxslər qoşulduqda xəbərdarlıq',"
);

content = content.replace(
  "'profile.accessibility': 'Доступность',",
  "'profile.accessibility': 'Доступность',\n    'profile.new_neighbors': 'Новые Соседи и Демография',\n    'profile.new_neighbors_desc': 'Уведомления, когда люди из вашей страны или со схожими интересами присоединяются',"
);

fs.writeFileSync('src/lib/i18n.ts', content);
