const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  "'profile.accessibility': 'Accessibility',",
  "'profile.accessibility': 'Accessibility',\n    'profile.router_code': 'My Router Code',\n    'profile.router_desc': 'Visible only to your immediate neighbors (within 50m).',\n    'profile.edit': 'Edit',\n    'profile.my_neighbors': 'My Neighbors',\n    'profile.neighbors_desc': 'Add neighbors manually by phone number to share router codes and closer updates.',\n    'profile.search_phone': 'Search phone (e.g. +994501112233)',\n    'profile.search': 'Search',\n    'profile.add': 'Add',\n    'profile.added_neighbors': 'Added Neighbors',\n    'profile.neighbor_not_found': 'Neighbor not found in your neighborhood.',"
);

content = content.replace(
  "'profile.accessibility': 'Əlçatanlıq',",
  "'profile.accessibility': 'Əlçatanlıq',\n    'profile.router_code': 'Mənim Router Kodum',\n    'profile.router_desc': 'Yalnız yaxın qonşularınız üçün (50m məsafədə) görünür.',\n    'profile.edit': 'Düzəliş et',\n    'profile.my_neighbors': 'Mənim Qonşularım',\n    'profile.neighbors_desc': 'Router kodları və daha yaxın yenilikləri paylaşmaq üçün qonşuları nömrə ilə əlavə edin.',\n    'profile.search_phone': 'Nömrə axtar (məs. +994501112233)',\n    'profile.search': 'Axtar',\n    'profile.add': 'Əlavə et',\n    'profile.added_neighbors': 'Əlavə Edilmiş Qonşular',\n    'profile.neighbor_not_found': 'Qonşu məhəllənizdə tapılmadı.',"
);

content = content.replace(
  "'profile.accessibility': 'Доступность',",
  "'profile.accessibility': 'Доступность',\n    'profile.router_code': 'Мой Код Роутера',\n    'profile.router_desc': 'Виден только вашим ближайшим соседям (в радиусе 50м).',\n    'profile.edit': 'Редактировать',\n    'profile.my_neighbors': 'Мои Соседи',\n    'profile.neighbors_desc': 'Добавляйте соседей вручную по номеру телефона для обмена кодами роутера и новостями.',\n    'profile.search_phone': 'Поиск по номеру (напр. +994501112233)',\n    'profile.search': 'Искать',\n    'profile.add': 'Добавить',\n    'profile.added_neighbors': 'Добавленные Соседи',\n    'profile.neighbor_not_found': 'Сосед не найден в вашем районе.',"
);

fs.writeFileSync('src/lib/i18n.ts', content);
