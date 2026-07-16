const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  "'feed.post_placeholder': 'Share something with your neighbors...',",
  "'feed.post_placeholder': 'Share something with your neighbors...',\n    'feed.resident_in': 'Resident in',\n    'feed.trust_score': 'Trust Score',\n    'feed.status': 'Status',\n    'feed.active': 'Active',\n    'feed.joined': 'Joined',\n    'feed.posts': 'Posts',\n    'feed.contributions': 'Contributions',\n    'feed.demographics': 'Demographics & Family',\n    'feed.nationality': 'Nationality',\n    'feed.children': 'Children',\n    'feed.pets': 'Pets',\n    'feed.recent_activity': 'Recent Activity',"
);

content = content.replace(
  "'feed.post_placeholder': 'Qonşularınızla nəsə paylaşın...',",
  "'feed.post_placeholder': 'Qonşularınızla nəsə paylaşın...',\n    'feed.resident_in': 'Sakin',\n    'feed.trust_score': 'Etibar Xalı',\n    'feed.status': 'Status',\n    'feed.active': 'Aktiv',\n    'feed.joined': 'Qoşulub',\n    'feed.posts': 'Paylaşımlar',\n    'feed.contributions': 'Töhfələr',\n    'feed.demographics': 'Demoqrafiya və Ailə',\n    'feed.nationality': 'Milliyyət',\n    'feed.children': 'Uşaqlar',\n    'feed.pets': 'Ev heyvanları',\n    'feed.recent_activity': 'Son Aktivlik',"
);

content = content.replace(
  "'feed.post_placeholder': 'Поделитесь чем-нибудь с соседями...',",
  "'feed.post_placeholder': 'Поделитесь чем-нибудь с соседями...',\n    'feed.resident_in': 'Житель в',\n    'feed.trust_score': 'Индекс доверия',\n    'feed.status': 'Статус',\n    'feed.active': 'Активен',\n    'feed.joined': 'Присоединился',\n    'feed.posts': 'Посты',\n    'feed.contributions': 'Вклады',\n    'feed.demographics': 'Демография и Семья',\n    'feed.nationality': 'Национальность',\n    'feed.children': 'Дети',\n    'feed.pets': 'Домашние животные',\n    'feed.recent_activity': 'Недавняя Активность',"
);

fs.writeFileSync('src/lib/i18n.ts', content);
