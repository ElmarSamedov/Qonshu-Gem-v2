const fs = require('fs');
let content = fs.readFileSync('src/components/CarNumbers.tsx', 'utf8');

content = content.replace(
  'const chatId = `neighbor-${searchResult.id}`;',
  'const chatId = getDeterministicChatId(user?.uid || "guest", `neighbor-${searchResult.id}`);'
);
content = content.replace(
  'await openOrCreateChat(getDeterministicChatId(user?.uid || \'guest\', chatId)',
  'await openOrCreateChat(chatId'
);
fs.writeFileSync('src/components/CarNumbers.tsx', content);
