const fs = require('fs');
let content = fs.readFileSync('src/components/profile/GamificationCard.tsx', 'utf8');

const regex = /\{badges\.length === 0 \? \([\s\S]*?\) : \(/;
const replacement = `{badges.length === 0 && !emptyProfileTrusted ? (
          <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <Trophy className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Complete actions to earn your first badge!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emptyProfileTrusted && (
              <div className="text-center py-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50">
                <ShieldCheck className="w-6 h-6 mx-auto text-amber-500 mb-1" />
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 px-4">You rarely post, but your neighbors trust you!</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1">Keep up the silent support.</p>
              </div>
            )}
`;

content = content.replace(regex, replacement);

const endRegex = /          <\/div>\n        \)}/;
const endReplacement = `          </div>
          </div>
        )}`;
content = content.replace(endRegex, endReplacement);

fs.writeFileSync('src/components/profile/GamificationCard.tsx', content);
console.log("Patched GamificationCard.tsx again");
