const fs = require('fs');
let content = fs.readFileSync('src/components/LocalBusinesses.tsx', 'utf8');

content = content.replace("Contact Locked for Guests", "{t('business.locked', language)}");
content = content.replace("Guests can view local professional and business listings, but direct contact and live messaging are reserved for registered neighbors.", "{t('business.locked_desc', language)}");
content = content.replace("Visit", "{t('common.visit', language)}");

fs.writeFileSync('src/components/LocalBusinesses.tsx', content);
