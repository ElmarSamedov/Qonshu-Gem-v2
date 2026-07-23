const fs = require('fs');
let content = fs.readFileSync('src/components/profile/GamificationCard.tsx', 'utf8');

// Add the new badges to BADGE_INFO
const regex = /'soulmate': \{ title: 'Soulmate', icon: Award, color: 'text-pink-500 bg-pink-500\/10', description: 'Found a neighbor match' \},/;
const replacement = `'soulmate': { title: 'Soulmate', icon: Award, color: 'text-pink-500 bg-pink-500/10', description: 'Found a neighbor match' },
  'mutual_aid_helped': { title: 'Helping Hand', icon: HeartHandshake, color: 'text-rose-500 bg-rose-500/10', description: 'Helped a neighbor in need' },
  'trusted_bronze': { title: 'Trusted Neighbor', icon: ShieldCheck, color: 'text-amber-600 bg-amber-600/10', description: 'Earned 10+ reliability score' },
  'trusted_silver': { title: 'Trusted Neighbor II', icon: ShieldCheck, color: 'text-slate-400 bg-slate-400/10', description: 'Earned 20+ reliability score' },
  'trusted_gold': { title: 'Trusted Neighbor III', icon: ShieldCheck, color: 'text-yellow-500 bg-yellow-500/10', description: 'Earned 50+ reliability score' },`;

content = content.replace(regex, replacement);

// Add missing imports
content = content.replace(
  "import { Flame, Medal, Star, Trophy, Award, Target, Hash } from 'lucide-react';",
  "import { Flame, Medal, Star, Trophy, Award, Target, Hash, ShieldCheck, HeartHandshake } from 'lucide-react';"
);

// Add the reliability score UI
const regex2 = /const streak = user.currentStreak \|\| 0;/;
const replacement2 = `const streak = user.currentStreak || 0;
  const reliabilityScore = user.reliabilityScore || 0;
  
  const hasPosted = badges.includes('first_word');
  const emptyProfileTrusted = !hasPosted && reliabilityScore > 0;`;

content = content.replace(regex2, replacement2);

// Replace empty state
const emptyStateRegex = /\{badges\.length === 0 \? \([\s\S]*?\) : \(/;
const newEmptyState = `{badges.length === 0 ? (
          emptyProfileTrusted ? (
            <div className="text-center py-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50">
              <ShieldCheck className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 px-4">You rarely post, but your neighbors trust you!</p>
              <p className="text-xs text-amber-600/80 dark:text-amber-500/80 mt-1">Keep up the silent support.</p>
            </div>
          ) : (
            <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <Trophy className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Complete actions to earn your first badge!</p>
            </div>
          )
        ) : (`;

content = content.replace(emptyStateRegex, newEmptyState);

// Add reliability score to top panel
const topPanelRegex = /<h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Points<\/h3>/;
const topPanelReplacement = `<div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Points</h3>
              <div className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{reliabilityScore} Trust</span>
              </div>
            </div>`;

content = content.replace(topPanelRegex, topPanelReplacement);

fs.writeFileSync('src/components/profile/GamificationCard.tsx', content);
console.log("Patched GamificationCard.tsx");
