import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useThemeStore } from '../store/useThemeStore';
import { t } from '../lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bell, ShieldCheck, MapPin, Star, AlertTriangle, Store, MessageCircle, Calendar, LogOut, CheckCircle2, XCircle, Globe, Type, Moon, Sun, BadgeCheck, Camera, Search, UserPlus, Wifi, Check, X } from 'lucide-react';
import { 
  generateCountryId,
  generateCityId,
  generateTownId,
  generateDistrictId,
  generateStreetId,
  generateBuildingId,
  generateEntranceId,
  generateApartmentId
} from '../lib/idGenerator';

import CarNumbers from "./CarNumbers";
import BirthdaySettings from "./BirthdaySettings";
import InterestsSelector from "./InterestsSelector";
import NationalitySelector from "./NationalitySelector";

export default function Profile() {
  const { user, logout, updateUser, addLocation, removeLocation } = useAuthStore();
  const isGuest = user?.role === 'guest';
  const { language, setLanguage } = useLanguageStore();
  const { seniorMode, toggleSeniorMode } = useSettingsStore();

  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocType, setNewLocType] = useState<'HOME' | 'WORK' | 'PARENTS' | 'VACATION' | 'OTHER'>('HOME');
  const [newLocName, setNewLocName] = useState('Home Address');
  const [newLocDistrict, setNewLocDistrict] = useState('Sabail');
  const [newLocStreet, setNewLocStreet] = useState('');
  const [newLocBuilding, setNewLocBuilding] = useState('');
  const [newLocApartment, setNewLocApartment] = useState('');
  
  const country = user?.country || 'Azerbaijan';
  const countryId = user?.countryId || generateCountryId(country);
  const city = user?.city || 'Baku';
  const cityId = user?.cityId || generateCityId(city, countryId);
  const town = user?.town || 'Sabail';
  const townId = user?.townId || generateTownId(town, cityId);
  const district = user?.district || 'Sabail';
  const districtId = user?.districtId || generateDistrictId(district, cityId);
  const street = user?.street || 'Nizami St';
  const streetId = user?.streetId || generateStreetId(street, districtId);
  const building = user?.building || '42';
  const buildingId = user?.buildingId || generateBuildingId(building, streetId);
  const entrance = user?.entrance || '2';
  const entranceId = user?.entranceId || generateEntranceId(entrance, buildingId);
  const apartment = user?.apartment || '15';
  const apartmentId = user?.apartmentId || generateApartmentId(apartment, buildingId);

  const [searchPhone, setSearchPhone] = useState('');
  const [addedNeighbors, setAddedNeighbors] = useState([
    { id: 1, name: 'Aysel H.', phone: '+994501234567', distance: '10m (Next door)' },
    { id: 2, name: 'Kamran B.', phone: '+994559876543', distance: '30m (Same floor)' }
  ]);
  const [routerCode, setRouterCode] = useState('MyWiFi_Guest / Pass: qonsu123');
  const [wifiSsid, setWifiSsid] = useState('MyWiFi_Guest');
  const [wifiPassword, setWifiPassword] = useState('qonsu123');
  const [showWifiToNeighbors, setShowWifiToNeighbors] = useState(true);
  const [isEditingRouter, setIsEditingRouter] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = () => {
    if (searchPhone === '+994501112233') {
      setSearchResult({ id: 3, name: 'Tural S.', phone: '+994501112233', distance: '15m (Downstairs)' });
    } else {
      alert(t('profile.neighbor_not_found', language));
      setSearchResult(null);
    }
  };

  const handleAddNeighbor = () => {
    if (searchResult) {
      setAddedNeighbors([...addedNeighbors, searchResult]);
      setSearchResult(null);
      setSearchPhone('');
    }
  };
  const { theme, toggleTheme } = useThemeStore();

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
  
  const [notifications, setNotifications] = useState({
    securityAlerts: true,
    marketplace: true,
    events: false,
    messages: true,
    newNeighbors: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
                {user.is_verified && <BadgeCheck className="h-5 w-5 text-blue-500" title="Verified Neighbor" />}
                {user.isMilestoneUser && <BadgeCheck className="h-5 w-5 text-yellow-500" title="Milestone Member (100th, 1000th, etc.)" />}
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
          <CarNumbers />
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{t('profile.family_demographics', language)}</h3>
            <div className="space-y-4">
              <NationalitySelector />
            </div>
          </div>
            
            <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex justify-between items-center">
                <span>My Locations</span>
                <span 
                  onClick={() => setShowAddLocation(!showAddLocation)} 
                  className="text-xs font-normal text-indigo-500 hover:text-indigo-600 cursor-pointer transition-colors"
                >
                  {showAddLocation ? 'Close Form' : '+ Add Location'}
                </span>
              </h3>

              {showAddLocation && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newLocStreet || !newLocBuilding || !newLocApartment) {
                    alert('Please fill out street, building, and apartment fields');
                    return;
                  }
                  addLocation({
                    type: newLocType,
                    name: newLocName || `${newLocType.charAt(0) + newLocType.slice(1).toLowerCase()} Address`,
                    district: newLocDistrict,
                    address: `${newLocStreet}, Bldg ${newLocBuilding}, Apt ${newLocApartment}`,
                    country,
                    city,
                  });
                  setShowAddLocation(false);
                  setNewLocStreet('');
                  setNewLocBuilding('');
                  setNewLocApartment('');
                }} className="p-4 mb-4 border border-indigo-500/30 rounded-xl bg-indigo-500/5 space-y-3 text-left">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Location Type</label>
                      <select 
                        value={newLocType} 
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setNewLocType(val);
                          setNewLocName(val.charAt(0) + val.slice(1).toLowerCase() + ' Address');
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="HOME">HOME</option>
                        <option value="WORK">WORK</option>
                        <option value="PARENTS">PARENTS</option>
                        <option value="VACATION">VACATION</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Custom Name</label>
                      <input 
                        type="text" 
                        value={newLocName} 
                        onChange={(e) => setNewLocName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">District</label>
                      <select 
                        value={newLocDistrict} 
                        onChange={(e) => setNewLocDistrict(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Sabail">Sabail</option>
                        <option value="Nasimi">Nasimi</option>
                        <option value="Yasamal">Yasamal</option>
                        <option value="Narimanov">Narimanov</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Street</label>
                      <input 
                        type="text" 
                        placeholder="Nizami St" 
                        value={newLocStreet} 
                        onChange={(e) => setNewLocStreet(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Building</label>
                      <input 
                        type="text" 
                        placeholder="42" 
                        value={newLocBuilding} 
                        onChange={(e) => setNewLocBuilding(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Apartment</label>
                      <input 
                        type="text" 
                        placeholder="15" 
                        value={newLocApartment} 
                        onChange={(e) => setNewLocApartment(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end pt-1">
                    <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddLocation(false)}>Cancel</Button>
                    <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Location</Button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {user.locations?.map(loc => (
                  <div key={loc.id} className="flex justify-between items-center p-3 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">{loc.name}</span>
                        {loc.verified ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-[10px] font-bold">VERIFIED</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full text-[10px] font-bold">UNVERIFIED</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{loc.address} ({loc.district})</div>
                    </div>
                    {user.locations.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeLocation(loc.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 p-1.5 h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {(!user.locations || user.locations.length === 0) && (
                  <p className="text-sm text-slate-500 text-center py-4">No specific locations added yet. Add a home or workplace to unlock neighborhood features.</p>
                )}
              </div>
            </div>
            <BirthdaySettings />
          </Card>

          {/* Registry & Unique Object IDs */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-black/10 dark:border-white/10 pb-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">Durable Property Registry & Object IDs</CardTitle>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Deterministic unique identifiers generated for each level of your property hierarchy.
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {user && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-black/5 dark:border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold uppercase tracking-wider">User ID (Deterministic Format)</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{user.uid}</span>
                  </div>
                </div>
              )}
              
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {[
                  { name: 'Country', val: country, idVal: countryId },
                  { name: 'City', val: city, idVal: cityId },
                  { name: 'Town', val: town, idVal: townId },
                  { name: 'District', val: district, idVal: districtId },
                  { name: 'Street', val: street, idVal: streetId },
                  { name: 'Building', val: building, idVal: buildingId },
                  { name: 'Entrance', val: entrance, idVal: entranceId },
                  { name: 'Apartment', val: apartment, idVal: apartmentId },
                ].map((prop, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-500 font-medium block">{prop.name}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{prop.val}</span>
                    </div>
                    <span className="font-mono text-slate-900 dark:text-white font-medium bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-black/10 dark:border-white/10">{prop.idVal}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.language', language)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <button 
                onClick={() => setLanguage('en')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${language === 'en' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:bg-white/5 border border-transparent'}`}
              >
                English
              </button>
              <button 
                onClick={() => setLanguage('az')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${language === 'az' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:bg-white/5 border border-transparent'}`}
              >
                Azərbaycan
              </button>
              <button 
                onClick={() => setLanguage('ru')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${language === 'ru' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:bg-white/5 border border-transparent'}`}
              >
                Русский
              </button>
            </CardContent>
          </Card>
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
          {/* Router Code */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-5 w-5 text-blue-400" />
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Wi-Fi & Router Sharing</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingRouter(!isEditingRouter)}>
                  {isEditingRouter ? 'Cancel' : (t('profile.edit', language) || 'Edit')}
                </Button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t('profile.router_desc', language) || 'Choose whether to securely share your Wi-Fi details with immediate neighbors.'}
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {isEditingRouter ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Wi-Fi Network Name (SSID)</label>
                    <input 
                      type="text" 
                      value={wifiSsid} 
                      onChange={(e) => setWifiSsid(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-slate-600 dark:text-slate-400 font-semibold block">Wi-Fi Password</label>
                    <input 
                      type="text" 
                      value={wifiPassword} 
                      onChange={(e) => setWifiPassword(e.target.value)}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-sm text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">Display Password to Neighbors</span>
                      <span className="text-xs text-slate-500">Neighbors within 50m will be able to see your password.</span>
                    </div>
                    <input 
                      type="checkbox"
                      checked={showWifiToNeighbors}
                      onChange={(e) => setShowWifiToNeighbors(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 animate-none"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-indigo-600 text-white" onClick={() => setIsEditingRouter(false)}>Save</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">SSID</span>
                      <span className="font-mono text-slate-900 dark:text-white font-bold">{wifiSsid}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Password</span>
                      {showWifiToNeighbors ? (
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">{wifiPassword}</span>
                      ) : (
                        <span className="font-mono text-slate-400 italic">hidden from neighbors</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <div className={`h-2.5 w-2.5 rounded-full ${showWifiToNeighbors ? 'bg-emerald-500' : 'bg-orange-400'}`} />
                    <span className="text-slate-500 font-medium">
                      {showWifiToNeighbors ? 'Wi-Fi Password is visible to your neighbors' : 'Wi-Fi Password is hidden from everyone'}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Neighbors */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-emerald-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.my_neighbors', language) || 'My Neighbors'}</CardTitle>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {t('profile.neighbors_desc', language) || 'Add neighbors manually by phone number to share router codes and closer updates.'}
              </p>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={t('profile.search_phone', language) || "Search phone (e.g. +994501112233)"}
                    className="w-full pl-9 pr-4 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                  />
                </div>
                <Button onClick={handleSearch} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  {t('profile.search', language) || 'Search'}
                </Button>
              </div>
              
              {searchResult && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-emerald-900 dark:text-emerald-100">{isGuest ? 'Neighbor' : searchResult.name}</p>
                    {!isGuest && <p className="text-xs text-emerald-600 dark:text-emerald-400">{searchResult.distance}</p>}
                  </div>
                  <Button size="sm" onClick={handleAddNeighbor} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    {t('profile.add', language) || 'Add'}
                  </Button>
                </div>
              )}

              {addedNeighbors.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    {t('profile.added_neighbors', language) || 'Added Neighbors'}
                  </h4>
                  <div className="space-y-2">
                    {addedNeighbors.map((neighbor) => (
                      <div key={neighbor.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {(isGuest ? 'Neighbor' : neighbor.name).charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{isGuest ? 'Neighbor' : neighbor.name}</p>
                            {!isGuest && <p className="text-xs text-slate-500">{neighbor.distance}</p>}
                          </div>
                        </div>
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => setAddedNeighbors(addedNeighbors.filter(n => n.id !== neighbor.id))}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-indigo-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.notif_prefs', language)}</CardTitle>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Control what you get notified about to keep your feed relevant.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/5 dark:divide-white/5">
                
                {/* Security Alerts */}
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.security_alerts', language)}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.security_alerts_desc', language)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification('securityAlerts')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.securityAlerts ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.securityAlerts ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Messages */}
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.direct_msgs', language)}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.direct_msgs_desc', language)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification('messages')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.messages ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.messages ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Marketplace */}
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Store className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.market_activity', language)}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.market_activity_desc', language)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification('marketplace')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.marketplace ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.marketplace ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {/* Events */}
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.comm_events', language)}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.comm_events_desc', language)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification('events')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.events ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.events ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                {/* New Neighbors */}
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Globe className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.new_neighbors', language) || 'New Neighbors'}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.new_neighbors_desc', language) || 'Alerts when people from your country or with similar interests join nearby'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleNotification('newNeighbors')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${notifications.newNeighbors !== false ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.newNeighbors !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Accessibility Settings */}
          <Card className="glass-panel border-black/10 dark:border-white/10">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center space-x-2">
                <Type className="h-5 w-5 text-indigo-400" />
                <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.accessibility', language)}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/5 dark:divide-white/5">
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                      <Type className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.senior', language)}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.senior_desc', language)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleSeniorMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${seniorMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${seniorMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                <div className="p-4 flex items-center justify-between hover:bg-black/5 dark:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      {theme === 'dark' ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{t('profile.theme', language)}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{t('profile.theme_desc', language)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
