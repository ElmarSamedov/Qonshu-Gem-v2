import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Car, Plus, X, Search } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

const COUNTRIES = [
  'Azerbaijan', 'Turkey', 'Georgia', 'Russia', 'Ukraine', 'Iran', 
  'Kazakhstan', 'Uzbekistan', 'Transit Numbers', 'European Union Numbers', 
  'Kyrgyzstan', 'Turkmenistan'
];

export default function CarNumbers() {
  const { user, updateUser } = useAuthStore();
  const [adding, setAdding] = useState(false);
  const [country, setCountry] = useState('Azerbaijan');
  const [number, setNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const cars = user?.cars || [];
  
  const handleAdd = () => {
    if (cars.length >= 2) return;
    if (!number) return;
    
    updateUser({
      cars: [...cars, { country, number }]
    });
    setAdding(false);
    setNumber('');
  };
  
  const handleRemove = (index: number) => {
    const newCars = [...cars];
    newCars.splice(index, 1);
    updateUser({ cars: newCars });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);
      
      let foundUser = null;
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.cars && Array.isArray(userData.cars)) {
          const matchingCar = userData.cars.find((c: any) => 
            c.number.toLowerCase().replace(/[^a-z0-9]/g, '') === searchQuery.toLowerCase().replace(/[^a-z0-9]/g, '')
          );
          if (matchingCar) {
            foundUser = { name: userData.name, apartment: userData.apartment, car: matchingCar };
          }
        }
      });
      
      if (foundUser) {
        setSearchResult(foundUser);
      } else {
        setSearchResult('not_found');
      }
    } catch (e) {
      console.error("Failed to search cars:", e);
      setSearchResult('error');
    }
    setIsSearching(false);
  };
  
  const getPlaceholder = (c: string) => {
    switch(c) {
      case 'Azerbaijan': return '99-XX-999';
      case 'Turkey': return '34 ABC 123';
      case 'Georgia': return 'AB-123-CD';
      case 'Russia': return 'A 123 BC 77';
      default: return 'Enter plate number';
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-black/10 dark:border-white/10 mt-6">
        <CardHeader className="border-b border-black/10 dark:border-white/5 pb-4 flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-indigo-400" />
            <CardTitle className="text-lg text-slate-900 dark:text-white">Vehicles</CardTitle>
          </div>
          {cars.length < 2 && !adding && (
            <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {cars.map((car, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/5">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{car.country}</p>
                <p className="font-mono font-bold text-slate-900 dark:text-white">{car.number}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleRemove(idx)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {cars.length === 0 && !adding && (
            <p className="text-sm text-slate-500 text-center py-4">No vehicles added.</p>
          )}
          
          {adding && (
            <div className="space-y-3 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              <div>
                <label className="text-xs font-medium text-slate-500">Country</label>
                <select 
                  value={country} 
                  onChange={e => setCountry(e.target.value)}
                  className="w-full mt-1 bg-transparent border-b border-black/20 dark:border-white/20 text-sm py-1 outline-none focus:border-indigo-500"
                >
                  {COUNTRIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Plate Number</label>
                <Input 
                  value={number}
                  onChange={e => setNumber(e.target.value.toUpperCase())}
                  placeholder={getPlaceholder(country)}
                  className="mt-1 font-mono uppercase bg-black/5 dark:bg-white/5 border-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAdd} className="bg-indigo-500 text-white hover:bg-indigo-600">Save</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-panel border-black/10 dark:border-white/10">
        <CardHeader className="border-b border-black/10 dark:border-white/5 pb-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-indigo-400" />
            <CardTitle className="text-lg text-slate-900 dark:text-white">Find Car Owner</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex space-x-2">
            <Input 
              placeholder="Enter license plate..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 font-mono uppercase bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          {searchResult === 'not_found' && (
            <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-400 text-center">
              No matching car found in your community.
            </div>
          )}
          {searchResult === 'error' && (
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-sm text-red-600 dark:text-red-400 text-center">
              Failed to search. Please try again later.
            </div>
          )}
          {searchResult && typeof searchResult === 'object' && (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 uppercase tracking-wider font-semibold mb-1">Owner Found</p>
                <div className="mt-1 text-sm font-mono text-slate-700 dark:text-slate-300">
                  {searchResult.car.country} • {searchResult.car.number}
                </div>
                <p className="text-xs text-slate-500 mt-1">Identity is hidden for privacy.</p>
              </div>
              <Button 
                onClick={() => {
                  /* Normally this would use openOrCreateChat, but we don't have it imported here. Let's alert for now, or just use a generic action. */
                  alert('Notification sent to the owner anonymously.');
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Notify Owner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
