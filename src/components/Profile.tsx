import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { Button } from './ui/button';
import { LogOut, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

import CarNumbers from "./CarNumbers";
import BirthdaySettings from "./BirthdaySettings";
import InterestsSelector from "./InterestsSelector";
import NationalitySelector from "./NationalitySelector";

import UserTrustCard from './profile/UserTrustCard';
import MyLocations from './profile/MyLocations';
import WifiSharing from './profile/WifiSharing';
import MyNeighbors from './profile/MyNeighbors';
import SettingsSection from './profile/SettingsSection';
import LanguageSelector from './profile/LanguageSelector';
import RegistrySection from './profile/RegistrySection';
import EmergencyContact from './profile/EmergencyContact';

export default function Profile() {
  const { user, logout, updateUser } = useAuthStore();
  const { language } = useLanguageStore();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('profile.title', language)}</h2>
        <Button variant="outline" size="sm" onClick={logout} className="text-red-400 border-red-400/30 hover:bg-red-500/10">
          <LogOut className="h-4 w-4 mr-2" />
          {t('profile.signout', language)}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info Column */}
        <div className="md:col-span-1 space-y-6">
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <UserTrustCard />
            <EmergencyContact />
            <CarNumbers />
            <div className="p-6 border-b border-black/10 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('profile.family_demographics', language) || 'Family & Demographics'}</h3>
              <div className="space-y-4">
                <NationalitySelector />
              </div>
            </div>
            <MyLocations />
            <BirthdaySettings />
          </Card>

          <RegistrySection />
          <LanguageSelector />
        </div>

        {/* Settings Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Interests Section */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">Interests</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <InterestsSelector 
                selectedIds={user?.interests || []} 
                onChange={(interests) => {
                  updateUser({ interests });
                }} 
              />
            </CardContent>
          </Card>
          
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardContent className="p-0">
              <WifiSharing />
            </CardContent>
          </Card>
          
          <MyNeighbors />
          <SettingsSection />
        </div>
      </div>
    </div>
  );
}
