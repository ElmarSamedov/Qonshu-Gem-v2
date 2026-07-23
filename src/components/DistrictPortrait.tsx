import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { useInterestsStore } from '../store/useInterestsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { motion } from 'motion/react';
import { t } from '../lib/i18n';
import { Users, CheckCircle, Heart, MessageSquare } from 'lucide-react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';

export default function DistrictPortrait() {
  const { user } = useAuthStore();
  const { interests, fetchInterests } = useInterestsStore();
  const { language } = useLanguageStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterests();
  }, [fetchInterests]);

  useEffect(() => {
    if (!user?.district) return;
    
    const unsubscribe = onSnapshot(doc(db, 'district_stats', user.district), (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data());
      } else {
        setStats(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.district]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!stats || !stats.totalResidents) {
    return (
      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-black/10 dark:border-white/10 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Living Portrait</h2>
        <p className="text-slate-600 dark:text-slate-400">The district is still growing. A portrait will appear here soon.</p>
      </div>
    );
  }

  // K-anonymity rule: only show interest breakdown if we have at least 5 contributors per category.
  // We'll filter interests that have a count of at least 5.
  const getInterestName = (id: string) => {
    const match = interests.find(i => i.id === id);
    if (!match) return id;
    if (language === 'ru') return match.interest_ru || match.interest_en;
    if (language === 'az') return match.interest_az || match.interest_en;
    return match.interest_en;
  };

  const MIN_CONTRIBUTORS = 5;
  const filteredInterests = Object.entries(stats.interests || {})
    .filter(([_, count]: any) => count >= MIN_CONTRIBUTORS)
    .map(([id, count]) => ({
      name: getInterestName(id),
      size: count,
      id
    }))
    .sort((a: any, b: any) => b.size - a.size);

  const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042', '#ff7f50', '#ff6b6b'];

  const treemapData = filteredInterests.map((item: any, index: number) => ({
    ...item,
    fill: colors[index % colors.length]
  }));

  const verifiedPercent = stats.totalResidents ? Math.round(((stats.verifiedResidents || 0) / stats.totalResidents) * 100) : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-2 border border-black/10 dark:border-white/10 rounded shadow-lg text-sm">
          <p className="font-bold">{payload[0].payload.name}</p>
          <p className="text-slate-600 dark:text-slate-300">{payload[0].value} neighbors</p>
        </div>
      );
    }
    return null;
  };

  const CustomizedContent = (props: any) => {
    const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : '#ffffff00',
            stroke: '#fff',
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
            opacity: 0.8
          }}
        />
        {width > 50 && height > 30 && (
          <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">
            {name}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-black/10 dark:border-white/10 overflow-hidden relative">
      {/* Background visual elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Living Portrait</h2>
          <p className="text-slate-600 dark:text-slate-400">A real-time abstract reflection of {user?.district}</p>
        </div>
        <button 
          onClick={() => {
            // In a real app, this would use html2canvas or similar to share an image
            alert("Sharing the district portrait...");
          }}
          className="text-sm font-semibold bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl shadow border border-indigo-100 dark:border-indigo-900/30 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
        >
          Share Portrait
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-blue-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalResidents || 0}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Neighbors</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{verifiedPercent}%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Verified</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <Heart className="w-8 h-8 text-rose-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDeeds || 0}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Good Deeds</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-center">
          <MessageSquare className="w-8 h-8 text-indigo-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalPosts || 0}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Discussions</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-black/5 dark:border-white/5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Community Interests</h3>
        
        {treemapData.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent colors={colors} />}
              >
                <Tooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl">
            <div className="w-16 h-16 mb-4 opacity-50 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              We need at least {MIN_CONTRIBUTORS} neighbors sharing the same interest<br/>to display the community mosaic safely.
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
              Invite more neighbors to uncover the portrait!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
