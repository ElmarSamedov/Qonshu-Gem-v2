import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function MyLocations() {
  const { user, addLocation, removeLocation } = useAuthStore();
  const [showAddLocation, setShowAddLocation] = useState(false);
  
  const [newLocType, setNewLocType] = useState<'HOME' | 'WORK' | 'PARENTS' | 'VACATION' | 'OTHER'>('HOME');
  const [newLocName, setNewLocName] = useState('Home Address');
  const [newLocDistrict, setNewLocDistrict] = useState('Sabail');
  const [newLocStreet, setNewLocStreet] = useState('');
  const [newLocBuilding, setNewLocBuilding] = useState('');
  const [newLocApartment, setNewLocApartment] = useState('');
  
  const country = user?.country || 'Azerbaijan';
  const city = user?.city || 'Baku';

  if (!user) return null;

  return (
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
      </div>
    </div>
  );
}
