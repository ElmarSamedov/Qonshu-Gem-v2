const fs = require('fs');
let content = fs.readFileSync('src/components/VerificationGate.tsx', 'utf8');

content = content.replace("Create an Account", "{t('verify.create_account', language)}");
content = content.replace("Guests can browse, but you must create an account to post and participate in the community.", "{t('verify.guest_desc', language)}");

fs.writeFileSync('src/components/VerificationGate.tsx', content);
