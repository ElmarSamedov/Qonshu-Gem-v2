const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Add Bell to imports if needed
if (!content.includes('import { Bell')) {
  content = content.replace("import { Home, Store, Calendar,", "import { Home, Store, Calendar, Bell,");
}

// Add state for notifications dropdown
content = content.replace(
  'const [showPaymentModal, setShowPaymentModal] = useState(false);',
  `const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userNationality = user?.nationality || 'Azerbaijani';
  
  const simulatedNotifications = [
    {
      id: 1,
      title: 'New Neighbor Alert',
      message: \`A person of your nationality (\${userNationality}) just joined the neighborhood. They are 45 meters away from you.\`,
      time: '2 mins ago',
      unread: true
    },
    {
      id: 2,
      title: 'Marketplace Update',
      message: 'Someone is interested in your listing.',
      time: '1 hour ago',
      unread: false
    }
  ];`
);

// Find where to insert the bell icon
const searchString = `<div className="flex items-center space-x-2">\n            <span className="font-semibold text-slate-800 dark:text-slate-200">{t('layout.ghost_mode', language)}</span>\n          </div>`;
const replacementString = `<div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              >
                <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 overflow-hidden z-50">
                  <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">Mark all as read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {simulatedNotifications.map(notif => (
                      <div key={notif.id} className={\`p-4 border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer \${notif.unread ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}\`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={\`text-sm font-semibold \${notif.unread ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}\`}>{notif.title}</h4>
                          <span className="text-xs text-slate-500">{notif.time}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 border-l border-black/10 dark:border-white/10 pl-4">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{t('layout.ghost_mode', language)}</span>
            </div>`;

content = content.replace(searchString, replacementString);

fs.writeFileSync('src/components/Layout.tsx', content);
