const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  "'mod.search_manage': 'Search, filter, and manage user accounts from this panel.',",
  `'mod.search_manage': 'Search, filter, and manage user accounts from this panel.',
    'layout.ghost_mode': 'Ghost Mode (Anonymity)',
    'layout.ghost_mode_desc': 'Enjoy complete anonymity across the platform for a $5/month subscription. Your name and avatar will be hidden.',
    'layout.activate_ghost': 'Activate Ghost Mode',
    'layout.total': 'Total',
    'layout.cancel': 'Cancel',
    'layout.pay_activate': 'Pay & Activate',
    'common.share': 'Share',
    'common.neighborhood': 'Neighborhood',
    'common.building': 'Building',
    'common.free_stuff': 'Free Stuff',
    'common.groups': 'Groups',
    'common.chat': 'Chat',
    'common.success': 'Success',`
);

content = content.replace(
  "'mod.search_manage': 'İstifadəçi hesablarını buradan axtarın, filterləyin və idarə edin.',",
  `'mod.search_manage': 'İstifadəçi hesablarını buradan axtarın, filterləyin və idarə edin.',
    'layout.ghost_mode': 'Xəyal Rejimi (Anonimlik)',
    'layout.ghost_mode_desc': 'Ayda $5 ödənişlə platformada tam anonimlik əldə edin. Adınız və şəkliniz gizlədiləcək.',
    'layout.activate_ghost': 'Xəyal Rejimini Aktivləşdir',
    'layout.total': 'Cəmi',
    'layout.cancel': 'Ləğv Et',
    'layout.pay_activate': 'Ödə və Aktivləşdir',
    'common.share': 'Paylaş',
    'common.neighborhood': 'Məhəllə',
    'common.building': 'Bina',
    'common.free_stuff': 'Pulsuz Əşyalar',
    'common.groups': 'Qruplar',
    'common.chat': 'Söhbət',
    'common.success': 'Uğurlu',`
);

content = content.replace(
  "'mod.search_manage': 'Ищите, фильтруйте и управляйте аккаунтами пользователей.',",
  `'mod.search_manage': 'Ищите, фильтруйте и управляйте аккаунтами пользователей.',
    'layout.ghost_mode': 'Режим Призрака (Анонимность)',
    'layout.ghost_mode_desc': 'Наслаждайтесь полной анонимностью на платформе за подписку в $5/мес. Ваше имя и аватар будут скрыты.',
    'layout.activate_ghost': 'Активировать Режим Призрака',
    'layout.total': 'Итого',
    'layout.cancel': 'Отмена',
    'layout.pay_activate': 'Оплатить и Активировать',
    'common.share': 'Поделиться',
    'common.neighborhood': 'Район',
    'common.building': 'Здание',
    'common.free_stuff': 'Бесплатные вещи',
    'common.groups': 'Группы',
    'common.chat': 'Чат',
    'common.success': 'Успешно',`
);

fs.writeFileSync('src/lib/i18n.ts', content);
