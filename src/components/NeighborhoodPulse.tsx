import React, { useMemo } from 'react';
import { Card, CardContent } from './ui/card';
import { Activity, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const MOCK_ACTIVE_NEIGHBORS = 14;
const MOCK_SAFETY_SCORE = 82;
const MOCK_WEEKLY_TREND = [75, 78, 80, 85, 82, 80, 82];

export default function NeighborhoodPulse() {
  const getSentimentText = (score: number) => {
    if (score > 80) return "A quiet evening in the neighborhood is a great time for a walk.";
    if (score >= 50) return "Things are normal around here right now.";
    return "Be careful. There have been some recent reports.";
  };

  const sentimentText = getSentimentText(MOCK_SAFETY_SCORE);

  const getStatusColor = (score: number) => {
    if (score > 80) return "text-emerald-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusIcon = (score: number) => {
    if (score > 80) return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    if (score >= 50) return <Info className="w-5 h-5 text-yellow-500" />;
    return <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const data = useMemo(() => MOCK_WEEKLY_TREND.map((val, i) => ({ day: i, score: val })), []);

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (MOCK_SAFETY_SCORE / 100) * circumference;

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10 mb-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-50"></div>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-stretch">
          
          {/* Circular Score Indicator */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={`${getStatusColor(MOCK_SAFETY_SCORE)} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{MOCK_SAFETY_SCORE}</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Index</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between w-full">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Neighborhood Pulse
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                  {getStatusIcon(MOCK_SAFETY_SCORE)}
                  <span className="leading-snug">{sentimentText}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Nearby</span>
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {MOCK_ACTIVE_NEIGHBORS < 3 ? 'Several' : MOCK_ACTIVE_NEIGHBORS}
                  <span className="text-sm font-normal text-slate-500 ml-1">neighbors</span>
                </div>
              </div>

              <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3 border border-black/5 dark:border-white/5 flex flex-col justify-center relative overflow-hidden group">
                 <div className="flex items-center gap-2 mb-1 relative z-10">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weekly Trend</span>
                </div>
                <div className="absolute inset-0 pt-6 opacity-60 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
}
