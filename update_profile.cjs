const fs = require('fs');

let profile = fs.readFileSync('src/components/Profile.tsx', 'utf8');

const replacement = `
              <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Trust Level</span>
                  <span className="flex items-center font-bold text-indigo-500">
                    Level {user.trust_level || 0}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Identity Trust</span>
                    <span className="text-slate-900 dark:text-white font-medium">{user.trust_scores?.identity || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: \`\${Math.min(user.trust_scores?.identity || 0, 100)}%\` }}></div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-600 dark:text-slate-400">Location Trust</span>
                    <span className="text-slate-900 dark:text-white font-medium">{user.trust_scores?.location || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: \`\${Math.min(user.trust_scores?.location || 0, 100)}%\` }}></div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <span className="text-slate-600 dark:text-slate-400">Community Trust</span>
                    <span className="text-slate-900 dark:text-white font-medium">{user.trust_scores?.community || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                    <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: \`\${Math.min(user.trust_scores?.community || 0, 100)}%\` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm pt-2 border-t border-black/10 dark:border-white/10">
                  <span className="text-slate-600 dark:text-slate-400">Overall Trust Score</span>
                  <span className="flex items-center text-yellow-400 font-bold text-lg">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400" /> {user.trust_scores?.overall || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{t('profile.role', language)}</span>
                  <span className="text-slate-900 dark:text-white capitalize">{user.role}</span>
                </div>
`;

profile = profile.replace(/<div className="mt-6 pt-6 border-t border-black\/10 dark:border-white\/10 space-y-3">[\s\S]*?<div className="flex justify-between items-center text-sm">\s*<span className="text-slate-600 dark:text-slate-400">\{t\('profile.role', language\)\}<\/span>\s*<span className="text-slate-900 dark:text-white capitalize">\{user.role\}<\/span>\s*<\/div>/m, replacement);

fs.writeFileSync('src/components/Profile.tsx', profile);
