const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /export default function App\(\) \{\n  const \{ user, initAuthListener \} = useAuthStore\(\);/;
const replacement = `export default function App() {
  const { user, initAuthListener } = useAuthStore();
  const initChatListener = useChatStore(state => state.initListener);`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Fixed App.tsx");
