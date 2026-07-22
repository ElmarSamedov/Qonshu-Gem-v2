const fs = require('fs');
let content = fs.readFileSync('src/components/Marketplace.tsx', 'utf8');

content = content.replace("Local Marketplace Truncated", "{t('market.truncated', language)}");
content = content.replace("Guests can view basic marketplace listing titles, but prices, exact distances, views, and seller information are reserved for registered neighbors.", "{t('market.truncated_desc', language)}");
content = content.replace(/'Neighbor'/g, "t('common.neighbor', language)");
content = content.replace(/"Neighbor"/g, "t('common.neighbor', language)");
content = content.replace("Giveaway", "{t('common.giveaway', language)}");
content = content.replace(/>Giveaway</g, ">{t('common.giveaway', language)}<");
content = content.replace("Sell", "{t('common.sell', language)}");
content = content.replace(/>Sell</g, ">{t('common.sell', language)}<");

fs.writeFileSync('src/components/Marketplace.tsx', content);
