import React from 'react';
import { CardContent } from '../ui/card';
import { BadgeCheck, Camera, MapPin, Star } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { t } from '../../lib/i18n';

export default function UserTrustCard() {
  const { user, updateUser } = useAuthStore();
  const { language } = useLanguageStore();

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <CardContent className="p-6 text-center">
      <div className="relative w-24 h-24 mx-auto mb-4 group">
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-white text-3xl font-bold shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0)
          )}
        </div>
        <label className="absolute bottom-0 right-0 p-1.5 bg-blue-500 rounded-full cursor-pointer text-white shadow-lg border-2 border-white dark:border-slate-800 hover:bg-blue-600 transition-colors">
          <Camera className="w-4 h-4" />
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </label>
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex justify-center items-center gap-1">
        {user.name}
        {user.is_verified && <div title="Verified Neighbor"><BadgeCheck className="h-5 w-5 text-blue-500" /></div>}
        {user.isMilestoneUser && <div title="Milestone Member (100th, 1000th, etc.)"><BadgeCheck className="h-5 w-5 text-yellow-500" /></div>}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{user.phone}</p>
      
      <div className="flex items-center justify-center space-x-2 text-sm">
        <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-500" />
        <span className="text-slate-700 dark:text-slate-300">{user.district} District</span>
      </div>
      
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
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(user.trust_scores?.identity || 0, 100)}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-600 dark:text-slate-400">Location Trust</span>
            <span className="text-slate-900 dark:text-white font-medium">{user.trust_scores?.location || 0}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${Math.min(user.trust_scores?.location || 0, 100)}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-slate-600 dark:text-slate-400">Community Trust</span>
            <span className="text-slate-900 dark:text-white font-medium">{user.trust_scores?.community || 0}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(user.trust_scores?.community || 0, 100)}%` }}></div>
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
      </div>
    </CardContent>
  );
}
