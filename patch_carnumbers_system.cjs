const fs = require('fs');
let content = fs.readFileSync('src/components/CarNumbers.tsx', 'utf8');

content = content.replace(
  "await sendMessage(chatId, `A neighbor reports: your car ${searchResult.car.number} is blocking access`, undefined, 'system');",
  "await sendMessage(chatId, `A neighbor reports: your car ${searchResult.car.number} is blocking access`, undefined, user?.uid);"
);

fs.writeFileSync('src/components/CarNumbers.tsx', content);
console.log("Patched CarNumbers.tsx senderId");
