const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import Layout from './components/Layout';",
  "import Layout from './components/Layout';\nimport DistrictPortrait from './components/DistrictPortrait';"
);

content = content.replace(
  "          <Route path=\"businesses\" element={<LocalBusinesses />} />",
  "          <Route path=\"businesses\" element={<LocalBusinesses />} />\n          <Route path=\"portrait\" element={<DistrictPortrait />} />"
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx for portrait");
