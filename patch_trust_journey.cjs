const fs = require('fs');
let content = fs.readFileSync('src/components/profile/TrustJourney.tsx', 'utf8');

const target = `const community = user.trust_scores.community || 0;`;
const replacement = `const community = user.trust_scores.community || 0;
  const reliabilityScore = user.reliabilityScore || 0;`;

content = content.replace(target, replacement);

const cardTarget = `<CardTitle className="text-lg text-slate-900 dark:text-white flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" />
            Trust Journey
          </CardTitle>`;
const cardReplacement = `<div className="flex items-center justify-between w-full">
            <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 text-indigo-500" />
              Trust Journey
            </CardTitle>
            {reliabilityScore > 0 && (
              <div className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Award className="w-4 h-4 mr-1" />
                Trusted Neighbor ({reliabilityScore})
              </div>
            )}
          </div>`;

content = content.replace(cardTarget, cardReplacement);

fs.writeFileSync('src/components/profile/TrustJourney.tsx', content);
console.log("Patched TrustJourney.tsx");
