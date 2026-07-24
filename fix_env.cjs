const fs = require('fs');
let content = fs.readFileSync('.env.example', 'utf8');
if (!content.includes('FIREBASE_SERVICE_ACCOUNT_KEY')) {
  fs.appendFileSync('.env.example', '\n# FIREBASE_SERVICE_ACCOUNT_KEY: Required for server-side admin functions (trust points, etc.)\nFIREBASE_SERVICE_ACCOUNT_KEY=\n');
}
