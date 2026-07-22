const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(/'guest.marketplace': 'Marketplace',/g, "'guest.marketplace': 'Kiosk',");
content = content.replace(/'market.truncated': 'Local Marketplace Truncated',/g, "'market.truncated': 'Local Kiosk Truncated',");
content = content.replace(/'profile.market_activity': 'Marketplace Activity',/g, "'profile.market_activity': 'Kiosk Activity',");
content = content.replace(/'auth.feat1_title': 'Local Marketplace',/g, "'auth.feat1_title': 'Local Kiosk',");
content = content.replace(/'market.title': 'Local Market',/g, "'market.title': 'Local Kiosk',");
content = content.replace(/'market.title': 'Местный Маркет',/g, "'market.title': 'Местный Киоск',");
content = content.replace(/'market.title': 'Yerli Market',/g, "'market.title': 'Yerli Kiosk',");

fs.writeFileSync('src/lib/i18n.ts', content);
