const fs = require('fs');

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

profile = profile.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<BirthdaySettings \/>/m, '</div>\n</div>\n</div>\n</div>\n</div>\n<BirthdaySettings />');

fs.writeFileSync('src/components/Profile.tsx', profile);
