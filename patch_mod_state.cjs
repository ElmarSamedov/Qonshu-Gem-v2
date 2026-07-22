const fs = require('fs');
let content = fs.readFileSync('src/components/ModeratorPanel.tsx', 'utf8');

content = content.replace("  const [filterNsfw, setFilterNsfw] = useState(false);\n", "");
content = content.replace("  const [filterArLaw, setFilterArLaw] = useState(false);\n", "");

fs.writeFileSync('src/components/ModeratorPanel.tsx', content);
