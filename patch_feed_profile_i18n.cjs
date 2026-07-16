const fs = require('fs');
let content = fs.readFileSync('src/components/Feed.tsx', 'utf8');

content = content.replace(
  "Resident in {selectedNeighbor.locationScope === 'neighborhood' ? 'your neighborhood' : 'your building'}",
  "{t('feed.resident_in', language)} {selectedNeighbor.locationScope === 'neighborhood' ? t('common.neighborhood', language).toLowerCase() : t('common.building', language).toLowerCase()}"
);

content = content.replace(
  /<span>95 Trust Score<\/span>/g,
  '<span>95 {t(\'feed.trust_score\', language)}</span>'
);

content = content.replace(
  /<div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status<\/div>/g,
  '<div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t(\'feed.status\', language)}</div>'
);

content = content.replace(
  /<span className="w-2 h-2 rounded-full bg-green-500"><\/span> Active/g,
  '<span className="w-2 h-2 rounded-full bg-green-500"></span> {t(\'feed.active\', language)}'
);

content = content.replace(
  /<div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Joined<\/div>/g,
  '<div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t(\'feed.joined\', language)}</div>'
);

content = content.replace(
  /<div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Posts<\/div>/g,
  '<div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{t(\'feed.posts\', language)}</div>'
);

content = content.replace(
  /14 Contributions/g,
  '14 {t(\'feed.contributions\', language)}'
);

content = content.replace(
  /<h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Demographics & Family<\/h3>/g,
  '<h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">{t(\'feed.demographics\', language)}</h3>'
);

content = content.replace(
  /<span className="text-slate-500 dark:text-slate-400">Nationality<\/span>/g,
  '<span className="text-slate-500 dark:text-slate-400">{t(\'feed.nationality\', language)}</span>'
);

content = content.replace(
  /<span className="text-slate-500 dark:text-slate-400">Children<\/span>/g,
  '<span className="text-slate-500 dark:text-slate-400">{t(\'feed.children\', language)}</span>'
);

content = content.replace(
  /<span className="text-slate-500 dark:text-slate-400">Pets<\/span>/g,
  '<span className="text-slate-500 dark:text-slate-400">{t(\'feed.pets\', language)}</span>'
);

content = content.replace(
  /<h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Recent Activity<\/h3>/g,
  '<h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">{t(\'feed.recent_activity\', language)}</h3>'
);

fs.writeFileSync('src/components/Feed.tsx', content);
