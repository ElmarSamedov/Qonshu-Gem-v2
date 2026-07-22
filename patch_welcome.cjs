const fs = require('fs');
let content = fs.readFileSync('src/components/GuestWelcome.tsx', 'utf8');

content = content.replace(
  "onClick={() => navigate('/auth')}",
  "onClick={() => navigate('/onboarding')}"
);

fs.writeFileSync('src/components/GuestWelcome.tsx', content);
