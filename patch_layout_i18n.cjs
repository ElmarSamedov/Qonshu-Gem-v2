const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Replace Ghost Mode text
content = content.replace(
  '<span className="font-semibold text-slate-800 dark:text-slate-200">Ghost Mode (Anonymity)</span>',
  '<span className="font-semibold text-slate-800 dark:text-slate-200">{t(\'layout.ghost_mode\', language)}</span>'
);

content = content.replace(
  '<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Activate Ghost Mode</h3>',
  '<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t(\'layout.activate_ghost\', language)}</h3>'
);

content = content.replace(
  '<p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Enjoy complete anonymity across the platform for a $5/month subscription. Your name and avatar will be hidden.</p>',
  '<p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{t(\'layout.ghost_mode_desc\', language)}</p>'
);

content = content.replace(
  '<span className="font-semibold text-slate-700 dark:text-slate-300">Total</span>',
  '<span className="font-semibold text-slate-700 dark:text-slate-300">{t(\'layout.total\', language)}</span>'
);

content = content.replace(
  />\s*Cancel\s*<\/button>/,
  '>{t(\'layout.cancel\', language)}</button>'
);

content = content.replace(
  />\s*Pay & Activate\s*<\/button>/,
  '>{t(\'layout.pay_activate\', language)}</button>'
);

content = content.replace(
  "alert('Payment successful! Ghost Mode activated.');",
  "alert(t('common.success', language) + '!');"
);

fs.writeFileSync('src/components/Layout.tsx', content);
