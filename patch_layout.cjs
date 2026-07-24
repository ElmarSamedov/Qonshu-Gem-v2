const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Remove hardcoded notifications state
content = content.replace(
  /const \[showNotifications, setShowNotifications\] = useState\(false\);\n[\s\S]*?const markAllAsRead = \(\) => \{[\s\S]*?\};\n/,
  ""
);

content = content.replace("import LanguageSelector from './LanguageSelector';", "import LanguageSelector from './LanguageSelector';\nimport Notifications from './Notifications';");

// Replace the bell div
const bellRegex = /<div className="relative">\s*<button [\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)\s*\}\s*<\/div>/;
content = content.replace(bellRegex, '<Notifications />');

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout.tsx");
