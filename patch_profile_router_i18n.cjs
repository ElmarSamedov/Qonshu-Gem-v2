const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

content = content.replace(
  "alert('Neighbor not found in your neighborhood.');",
  "alert(t('profile.neighbor_not_found', language));"
);

content = content.replace(
  />My Router Code<\/CardTitle>/g,
  '>{t(\'profile.router_code\', language)}</CardTitle>'
);

content = content.replace(
  />Visible only to your immediate neighbors \(within 50m\)\.<\/p>/g,
  '>{t(\'profile.router_desc\', language)}</p>'
);

content = content.replace(
  />Edit<\/Button>/g,
  '>{t(\'profile.edit\', language)}</Button>'
);

content = content.replace(
  />My Neighbors<\/CardTitle>/g,
  '>{t(\'profile.my_neighbors\', language)}</CardTitle>'
);

content = content.replace(
  />Add neighbors manually by phone number to share router codes and closer updates\.<\/p>/g,
  '>{t(\'profile.neighbors_desc\', language)}</p>'
);

content = content.replace(
  /placeholder="Search phone \(e\.g\. \+994501112233\)"/g,
  'placeholder={t(\'profile.search_phone\', language)}'
);

content = content.replace(
  />Search<\/Button>/g,
  '>{t(\'profile.search\', language)}</Button>'
);

content = content.replace(
  />Add<\/Button>/g,
  '>{t(\'profile.add\', language)}</Button>'
);

content = content.replace(
  />Added Neighbors<\/h4>/g,
  '>{t(\'profile.added_neighbors\', language)}</h4>'
);

fs.writeFileSync('src/components/Profile.tsx', content);
