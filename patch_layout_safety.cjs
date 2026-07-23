const fs = require('fs');
let content = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Add Heart icon import if not there
if (!content.includes('Heart,')) {
  content = content.replace("PieChart } from 'lucide-react';", "PieChart, Heart } from 'lucide-react';");
}

const target = `<div className="flex items-center space-x-4">`;
const replacement = `<div className="flex items-center space-x-4">
            {!isGuest && user?.safetyCheckIn?.enabled && (
              <button 
                onClick={() => {
                  updateUser({
                    safetyCheckIn: {
                      ...user.safetyCheckIn,
                      lastCheckInDate: new Date().toISOString().split('T')[0]
                    }
                  });
                  // Also update streak if needed, or trigger gamification
                  fetch('/api/gamification/silent-action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetUid: user.uid, action: 'daily_login' })
                  }).catch(console.error);
                }}
                className={\`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all \${
                  user?.safetyCheckIn?.lastCheckInDate === new Date().toISOString().split('T')[0] 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-rose-500 text-white shadow-md shadow-rose-500/20 hover:bg-rose-600 animate-pulse'
                }\`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{user?.safetyCheckIn?.lastCheckInDate === new Date().toISOString().split('T')[0] ? "Checked In" : "I'm OK"}</span>
              </button>
            )}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Layout.tsx', content);
console.log("Patched Layout.tsx for I'm OK button");
