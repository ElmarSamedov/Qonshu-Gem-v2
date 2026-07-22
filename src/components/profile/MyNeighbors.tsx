import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Search, UserPlus, X, Map as MapIcon } from 'lucide-react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { t } from '../../lib/i18n';
import BuildingMap from './BuildingMap';

export default function MyNeighbors() {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const isGuest = user?.role === 'guest';

  const [searchPhone, setSearchPhone] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [addedNeighbors, setAddedNeighbors] = useState([
    { id: 1, name: 'Aysel H.', phone: '+994501234567', distance: '10m (Next door)' },
    { id: 2, name: 'Kamran B.', phone: '+994559876543', distance: '30m (Same floor)' }
  ]);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchPhone.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const q = query(collection(db, 'users'), where('phone', '==', searchPhone.trim()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        setSearchResult({ id: docSnap.id, name: data.name || 'Neighbor', phone: data.phone, distance: data.apartment || 'Neighbor' });
      } else {
        alert(t('profile.neighbor_not_found', language) || 'Neighbor not found.');
      }
    } catch (e) {
      console.error("Failed to search neighbors:", e);
    }
    setIsSearching(false);
  };

  const handleAddNeighbor = () => {
    if (searchResult) {
      setAddedNeighbors([...addedNeighbors, searchResult]);
      setSearchResult(null);
      setSearchPhone('');
    }
  };

  return (
    <Card className="glass-panel border-black/10 dark:border-white/10">
      <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-lg text-slate-900 dark:text-white">{t('profile.my_neighbors', language) || 'My Neighbors'}</CardTitle>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-[80%]">
            {t('profile.neighbors_desc', language) || 'Add neighbors manually by phone number to share router codes and closer updates.'}
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={() => setShowMap(!showMap)} className={showMap ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-500' : ''}>
          <MapIcon className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {showMap ? (
          <BuildingMap neighbors={addedNeighbors} />
        ) : (
          <>
            {false && (
          <>
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
              <Button onClick={handleSearch} disabled={isSearching || !searchPhone.trim()} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                {isSearching ? 'Searching...' : (t('profile.search', language) || 'Search')}
              </Button>
            </div>
            
            {searchResult && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                <div>
                  <p className="font-medium text-emerald-900 dark:text-emerald-100">{isGuest ? t('common.neighbor', language) : searchResult.name}</p>
                  {!isGuest && <p className="text-xs text-emerald-600 dark:text-emerald-400">{searchResult.distance}</p>}
                </div>
                <Button size="sm" onClick={handleAddNeighbor} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  {t('profile.add', language) || 'Add'}
                </Button>
              </div>
            )}
          </>
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
                      {(isGuest ? t('common.neighbor', language) : neighbor.name).charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{isGuest ? t('common.neighbor', language) : neighbor.name}</p>
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
        </>
        )}
      </CardContent>
    </Card>
  );
}
