import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Shield, ShieldAlert, ShieldCheck, Award, Zap, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { t } from '../../lib/i18n';

export default function TrustJourney() {
  const { user } = useAuthStore();
  const { language } = useLanguageStore();

  if (!user || !user.trust_scores) return null;

  const overall = user.trust_scores.overall || 0;
  const identity = user.trust_scores.identity || 0;
  const location = user.trust_scores.location || 0;
  const community = user.trust_scores.community || 0;
  const reliabilityScore = user.reliabilityScore || 0;

  const levels = [
    { threshold: 0, title: 'Newbie', icon: <ShieldAlert className="w-5 h-5" />, benefits: 'Can read public posts.' },
    { threshold: 30, title: 'Verified Neighbor', icon: <Shield className="w-5 h-5" />, benefits: 'Can comment and react.' },
    { threshold: 65, title: 'Verified Local', icon: <ShieldCheck className="w-5 h-5" />, benefits: 'Can post and use marketplace.' },
    { threshold: 90, title: 'Neighborhood Guardian', icon: <Award className="w-5 h-5" />, benefits: 'Access to moderation tools.' },
  ];

  let currentLevelIndex = 0;
  for (let i = 0; i < levels.length; i++) {
    if (overall >= levels[i].threshold) {
      currentLevelIndex = i;
    }
  }

  const nextLevel = currentLevelIndex < levels.length - 1 ? levels[currentLevelIndex + 1] : null;

  let actionPrompt = "";
  if (nextLevel) {
    const scores = [
      { type: 'identity', value: identity },
      { type: 'location', value: location },
      { type: 'community', value: community }
    ];
    
    scores.sort((a, b) => a.value - b.value);
    const lowest = scores[0].type;

    if (lowest === 'identity') {
      actionPrompt = "Verify your identity or phone number to advance to the next level.";
    } else if (lowest === 'location') {
      actionPrompt = "Verify your address to advance to the next level.";
    } else {
      actionPrompt = "Participate in the community by reacting to posts or helping neighbors to advance.";
    }
  }

  // Calculate progress for the progress bar
  const progressPercentage = Math.min(100, Math.max(0, overall));

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10 mb-6 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              Trust Journey
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Your overall trust score is <span className="font-bold text-indigo-600 dark:text-indigo-400">{overall}</span>. 
              {nextLevel ? ` Reach ${nextLevel.threshold} to become a ${nextLevel.title}.` : " You've reached the highest level!"}
            </p>
          </div>
        </div>

        {/* Horizontal Track */}
        <div className="relative mb-8 mt-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-1000 ease-out"
               style={{ width: `${progressPercentage}%` }}
             ></div>
          </div>
          
          <div className="relative flex justify-between">
            {levels.map((level, idx) => {
              const isAchieved = overall >= level.threshold;
              const isCurrent = idx === currentLevelIndex;
              
              return (
                <div key={idx} className="flex flex-col items-center relative z-10 w-1/4">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                      isCurrent ? 'bg-indigo-600 border-white dark:border-slate-800 text-white scale-125 shadow-lg shadow-indigo-500/30' :
                      isAchieved ? 'bg-emerald-500 border-white dark:border-slate-800 text-white' : 
                      'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {level.icon}
                  </div>
                  <div className={`text-center mt-3 ${isCurrent ? 'scale-105' : ''}`}>
                    <div className={`text-xs sm:text-sm font-bold ${
                      isCurrent ? 'text-indigo-600 dark:text-indigo-400' :
                      isAchieved ? 'text-slate-900 dark:text-white' : 
                      'text-slate-500 dark:text-slate-500'
                    }`}>
                      {level.title}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 px-1 hidden sm:block">
                      {level.benefits}
                    </div>
                    <div className={`text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full inline-block ${
                      isAchieved ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {level.threshold} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {nextLevel && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Next step to {nextLevel.title}</h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">{actionPrompt}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
