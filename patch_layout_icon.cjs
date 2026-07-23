const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

content = content.replace("Users, Sun, Moon", "Users, Sun, Moon, PieChart");
content = content.replace("{ to: '/portrait', icon: Users, label: 'Portrait' }", "{ to: '/portrait', icon: PieChart, label: 'Portrait' }");

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout.tsx icon");
