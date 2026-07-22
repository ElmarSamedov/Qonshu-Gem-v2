const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const additionsEn = `
    'guest.welcome': 'Welcome to Qonşu.',
    'guest.discover': 'Discover what\\'s happening around you.',
    'guest.local_feeds': 'Local Feeds',
    'guest.public_events': 'Public Events',
    'guest.marketplace': 'Marketplace',
    'guest.neighborhoods': 'Neighborhoods',
    'guest.explore': 'Explore Nearby',
    'guest.create_account': 'Create Account',
    'common.neighbor': 'Neighbor',
    'common.giveaway': 'Giveaway',
    'common.sell': 'Sell',
    'common.visit': 'Visit',
    'common.night_mode': 'Night Mode',
    'market.truncated': 'Local Marketplace Truncated',
    'market.truncated_desc': 'Guests can view basic marketplace listing titles, but prices, exact distances, views, and seller information are reserved for registered neighbors.',
    'business.locked': 'Contact Locked for Guests',
    'business.locked_desc': 'Guests can view local professional and business listings, but direct contact and live messaging are reserved for registered neighbors.',
    'verify.guest_desc': 'Guests can browse, but you must create an account to post and participate in the community.',`;

const additionsAz = `
    'guest.welcome': 'Qonşuya xoş gəlmisiniz.',
    'guest.discover': 'Ətrafınızda baş verənləri kəşf edin.',
    'guest.local_feeds': 'Yerli Lentlər',
    'guest.public_events': 'İctimai Tədbirlər',
    'guest.marketplace': 'Marketpleys',
    'guest.neighborhoods': 'Məhəllələr',
    'guest.explore': 'Yaxınlığı kəşf et',
    'guest.create_account': 'Hesab Yarat',
    'common.neighbor': 'Qonşu',
    'common.giveaway': 'Hədiyyə',
    'common.sell': 'Satış',
    'common.visit': 'Ziyarət et',
    'common.night_mode': 'Gecə Rejimi',
    'market.truncated': 'Yerli Marketpleys Qısaldılmış',
    'market.truncated_desc': 'Qonaqlar əsas bazar siyahısı başlıqlarını görə bilərlər, lakin qiymətlər, dəqiq məsafələr, baxışlar və satıcı məlumatları qeydiyyatdan keçmiş qonşular üçün saxlanılır.',
    'business.locked': 'Qonaqlar üçün Əlaqə Bağlıdır',
    'business.locked_desc': 'Qonaqlar yerli peşəkar və biznes siyahılarına baxa bilər, lakin birbaşa əlaqə və canlı mesajlaşma qeydiyyatdan keçmiş qonşular üçündür.',
    'verify.guest_desc': 'Qonaqlar platformada gəzə bilərlər, ancaq yazmaq və iştirak etmək üçün hesab yaratmalısınız.',`;

const additionsRu = `
    'guest.welcome': 'Добро пожаловать в Qonşu.',
    'guest.discover': 'Узнайте, что происходит вокруг вас.',
    'guest.local_feeds': 'Местные Ленты',
    'guest.public_events': 'Публичные Мероприятия',
    'guest.marketplace': 'Маркетплейс',
    'guest.neighborhoods': 'Районы',
    'guest.explore': 'Исследовать поблизости',
    'guest.create_account': 'Создать Аккаунт',
    'common.neighbor': 'Сосед',
    'common.giveaway': 'Отдам даром',
    'common.sell': 'Продажа',
    'common.visit': 'Посетить',
    'common.night_mode': 'Ночной Режим',
    'market.truncated': 'Ограниченный доступ к маркету',
    'market.truncated_desc': 'Гости могут просматривать заголовки, но цены, точное расстояние и информация о продавце доступны только зарегистрированным соседям.',
    'business.locked': 'Связь недоступна для гостей',
    'business.locked_desc': 'Гости могут просматривать список бизнесов, но прямая связь и сообщения доступны только зарегистрированным соседям.',
    'verify.guest_desc': 'Гости могут просматривать контент, но для публикации и участия в жизни сообщества необходимо создать аккаунт.',`;

// Insert into English
content = content.replace(/en:\s*\{/, "en: {" + additionsEn);
// Insert into Azerbaijani
content = content.replace(/az:\s*\{/, "az: {" + additionsAz);
// Insert into Russian
content = content.replace(/ru:\s*\{/, "ru: {" + additionsRu);

fs.writeFileSync('src/lib/i18n.ts', content);
