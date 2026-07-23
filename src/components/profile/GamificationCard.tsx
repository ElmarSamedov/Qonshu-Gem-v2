import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useAuthStore } from '../../store/useAuthStore';
import { Flame, Medal, Star, Trophy, Award, Target, Hash, ShieldCheck, HeartHandshake } from 'lucide-react';

const BADGE_INFO: Record<string, { title: string, icon: any, color: string, description: string }> = {
  'first_word': { title: 'First Word', icon: Target, color: 'text-blue-500 bg-blue-500/10', description: 'Published your first post' },
  'quarter_support': { title: 'Quarter Support', icon: Star, color: 'text-yellow-500 bg-yellow-500/10', description: 'Reached 100 points' },
  '7_day_streak': { title: '7 Day Streak', icon: Flame, color: 'text-orange-500 bg-orange-500/10', description: 'Logged in 7 days in a row' },
  'soulmate': { title: 'Soulmate', icon: Award, color: 'text-pink-500 bg-pink-500/10', description: 'Found a neighbor match' },
  'mutual_aid_helped': { title: 'Helping Hand', icon: HeartHandshake, color: 'text-rose-500 bg-rose-500/10', description: 'Helped a neighbor in need' },
  'trusted_bronze': { title: 'Trusted Neighbor', icon: ShieldCheck, color: 'text-amber-600 bg-amber-600/10', description: 'Earned 10+ reliability score' },
  'trusted_silver': { title: 'Trusted Neighbor II', icon: ShieldCheck, color: 'text-slate-400 bg-slate-400/10', description: 'Earned 20+ reliability score' },
  'trusted_gold': { title: 'Trusted Neighbor III', icon: ShieldCheck, color: 'text-yellow-500 bg-yellow-500/10', description: 'Earned 50+ reliability score' },
};

export default function GamificationCard() {
  const { user } = useAuthStore();
  
  if (!user || user.role === 'guest') return null;
  
  const points = user.points || 0;
  const badges = user.badges || [];
  const streak = user.currentStreak || 0;
  const reliabilityScore = user.reliabilityScore || 0;
  
  const hasPosted = badges.includes('first_word');
  const emptyProfileTrusted = !hasPosted && reliabilityScore > 0;

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10 mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Points</h3>
              <div className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{reliabilityScore} Trust</span>
              </div>
            </div>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{points}</span>
              <span className="text-sm font-semibold text-indigo-500 dark:text-indigo-400">PTS</span>
            </div>
          </div>
          
          <div className="text-right">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-end space-x-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Daily Streak</span>
            </h3>
            <div className="flex items-baseline justify-end space-x-1 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{streak}</span>
              <span className="text-xs font-medium text-slate-500">days</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center mb-4">
          <Medal className="w-4 h-4 mr-2 text-indigo-500" />
          Earned Badges
        </h3>
        
        {badges.length === 0 && !emptyProfileTrusted ? (
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

            <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <Trophy className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Complete actions to earn your first badge!</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {badges.filter(b => !b.startsWith('trusted_')).map(badgeId => {
              const info = BADGE_INFO[badgeId] || { title: badgeId, icon: Hash, color: 'text-slate-500 bg-slate-500/10', description: 'Special achievement' };
              const Icon = info.icon;
              return (
                <div key={badgeId} className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <div className={"p-2 rounded-lg " + info.color}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{info.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>
    </Card>
  );
}
