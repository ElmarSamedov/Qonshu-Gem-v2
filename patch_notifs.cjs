const fs = require('fs');
let content = fs.readFileSync('src/components/Notifications.tsx', 'utf8');

const targetImport = "import { motion, AnimatePresence } from 'motion/react';";
const replacementImport = "import { motion, AnimatePresence } from 'motion/react';\nimport { useInterestsStore } from '../store/useInterestsStore';\nimport { useLanguageStore } from '../store/useLanguageStore';";
content = content.replace(targetImport, replacementImport);

const stateCode = `  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);`;

const newStateCode = `  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { interests, fetchInterests } = useInterestsStore();
  const { language } = useLanguageStore();

  useEffect(() => {
    // If there are unread notifications with interestIds, we should fetch interests
    const needsInterests = notifications.some(n => !n.read && n.interestIds && n.interestIds.length > 0);
    if (needsInterests) {
      fetchInterests();
    }
  }, [notifications, fetchInterests]);

  const getInterestNames = (ids: string[]) => {
    if (!interests || interests.length === 0) return ids.join(', ');
    return ids.map(id => {
      const match = interests.find(i => i.id === id);
      if (!match) return id;
      if (language === 'ru') return match.interest_ru || match.interest_en;
      if (language === 'az') return match.interest_az || match.interest_en;
      return match.interest_en;
    }).join(', ');
  };`;

content = content.replace(stateCode, newStateCode);

const msgCode = "<p className=\"text-slate-600 dark:text-slate-300 text-sm mt-1\">{notif.message}</p>";
const newMsgCode = `<p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {notif.message}
                {notif.interestIds && notif.interestIds.length > 0 && (
                  <span className="block font-medium mt-1 text-indigo-600 dark:text-indigo-400">
                    {getInterestNames(notif.interestIds)}
                  </span>
                )}
              </p>`;
content = content.replace(msgCode, newMsgCode);

fs.writeFileSync('src/components/Notifications.tsx', content);
console.log("Updated Notifications.tsx");
