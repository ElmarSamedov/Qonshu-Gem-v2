const fs = require('fs');
let content = fs.readFileSync('src/components/CarNumbers.tsx', 'utf8');

// Import useChatStore and useNavigate
content = content.replace(
  "import { useAuthStore } from '../store/useAuthStore';",
  "import { useAuthStore } from '../store/useAuthStore';\nimport { useChatStore } from '../store/useChatStore';\nimport { useNavigate } from 'react-router-dom';"
);

// Add hooks in component
content = content.replace(
  "  const [isSearching, setIsSearching] = useState(false);",
  "  const [isSearching, setIsSearching] = useState(false);\n  const { openOrCreateChat, sendMessage } = useChatStore();\n  const navigate = useNavigate();"
);

// Update searchResult to include id
content = content.replace(
  "foundUser = { name: userData.name, apartment: userData.apartment, car: matchingCar };",
  "foundUser = { id: doc.id, name: userData.name, apartment: userData.apartment, car: matchingCar };"
);

// Replace the notify owner button logic
const buttonOld = `              <Button \n                onClick={() => {\n                  /* Normally this would use openOrCreateChat, but we don't have it imported here. Let's alert for now, or just use a generic action. */\n                  alert('Notification sent to the owner anonymously.');\n                }}\n                className="bg-indigo-600 hover:bg-indigo-700 text-white"\n              >\n                Notify Owner\n              </Button>`;

const buttonNew = `              <Button \n                onClick={async () => {\n                  const chatId = \`neighbor-\${searchResult.id}\`;\n                  await openOrCreateChat(chatId, \`Neighbor (\${searchResult.car.number})\`, 'neighbor');\n                  await sendMessage(chatId, \`A neighbor reports: your car \${searchResult.car.number} is blocking access\`, undefined, 'system');\n                  navigate('/chat');\n                }}\n                className="bg-indigo-600 hover:bg-indigo-700 text-white"\n              >\n                Notify Owner\n              </Button>`;

content = content.replace(buttonOld, buttonNew);

fs.writeFileSync('src/components/CarNumbers.tsx', content);
