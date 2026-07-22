const fs = require('fs');
let content = fs.readFileSync('firestore.rules', 'utf8');

content = content.replace(
  "incoming().role == 'user'",
  "(incoming().role == 'user' || (request.auth.token.email == 'elmar.myspace@gmail.com' && incoming().role == 'moderator'))"
);

fs.writeFileSync('firestore.rules', content);
