const fs = require('fs');
let content = fs.readFileSync('src/components/GuestWelcome.tsx', 'utf8');

const importRegex = /import \{ useLanguageStore \} from '\.\.\/store\/useLanguageStore';/;
const importReplacement = `import { useLanguageStore } from '../store/useLanguageStore';\nimport { useAuthStore } from '../store/useAuthStore';`;
content = content.replace(importRegex, importReplacement);

const hookRegex = /const navigate = useNavigate\(\);/;
const hookReplacement = `const navigate = useNavigate();\n  const { createGuestSession } = useAuthStore();`;
content = content.replace(hookRegex, hookReplacement);

const onClickRegex = /onClick=\{\(\) => navigate\('\/feed'\)\}/;
const onClickReplacement = `onClick={() => { createGuestSession(); navigate('/feed'); }}`;
content = content.replace(onClickRegex, onClickReplacement);

fs.writeFileSync('src/components/GuestWelcome.tsx', content);
console.log("Patched GuestWelcome.tsx");
