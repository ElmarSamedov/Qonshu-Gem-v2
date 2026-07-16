const fs = require('fs');
let content = fs.readFileSync('src/components/Profile.tsx', 'utf8');

// The file needs to import t. It's already there?
// `import { t } from '../lib/i18n';` Let's verify.
if (!content.includes("import { t } from '../lib/i18n';")) {
  content = content.replace("import { useThemeStore } from '../store/useThemeStore';", "import { useThemeStore } from '../store/useThemeStore';\nimport { t } from '../lib/i18n';");
}

content = content.replace(
  />Status<\/span>/g,
  '>{t(\'profile.status\', language)}</span>'
);

content = content.replace(
  />Business<\/span>/g,
  '>{t(\'profile.business\', language)}</span>'
);

content = content.replace(
  />Trust Rating<\/span>/g,
  '>{t(\'profile.trust_rating\', language)}</span>'
);

content = content.replace(
  />Role<\/span>/g,
  '>{t(\'profile.role\', language)}</span>'
);

content = content.replace(
  />Family & Demographics<\/h3>/g,
  '>{t(\'profile.family_demographics\', language)}</h3>'
);

content = content.replace(
  />Nationality<\/label>/g,
  '>{t(\'profile.nationality\', language)}</label>'
);

content = content.replace(
  />Number of Children<\/label>/g,
  '>{t(\'profile.num_children\', language)}</label>'
);

content = content.replace(
  />Ages \(e.g. 5, 8\)<\/label>/g,
  '>{t(\'profile.ages_example\', language)}</label>'
);

content = content.replace(
  />Notification Preferences<\/CardTitle>/g,
  '>{t(\'profile.notif_prefs\', language)}</CardTitle>'
);

content = content.replace(
  />Security & Alerts<\/p>/g,
  '>{t(\'profile.security_alerts\', language)}</p>'
);

content = content.replace(
  />Emergency alerts, suspicious activities, neighborhood watch updates<\/p>/g,
  '>{t(\'profile.security_alerts_desc\', language)}</p>'
);

content = content.replace(
  />Direct Messages<\/p>/g,
  '>{t(\'profile.direct_msgs\', language)}</p>'
);

content = content.replace(
  />When neighbors message you or reply to your comments<\/p>/g,
  '>{t(\'profile.direct_msgs_desc\', language)}</p>'
);

content = content.replace(
  />Marketplace Activity<\/p>/g,
  '>{t(\'profile.market_activity\', language)}</p>'
);

content = content.replace(
  />New items given away or lent nearby, offers on your listings<\/p>/g,
  '>{t(\'profile.market_activity_desc\', language)}</p>'
);

content = content.replace(
  />Community Events<\/p>/g,
  '>{t(\'profile.comm_events\', language)}</p>'
);

content = content.replace(
  />Local meetups, building meetings, neighborhood gatherings<\/p>/g,
  '>{t(\'profile.comm_events_desc\', language)}</p>'
);

content = content.replace(
  />Accessibility<\/CardTitle>/g,
  '>{t(\'profile.accessibility\', language)}</CardTitle>'
);

fs.writeFileSync('src/components/Profile.tsx', content);
