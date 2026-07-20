import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MapPin, Briefcase, Home, GraduationCap, Users, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';

export default function LocationSwitcher() {
  const { user, switchLocation } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || user.role === 'guest' || user.locations.length <= 1) {
    // Return a simple district display or nothing if guest
    if (user?.role === 'guest') {
      return (
         <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
           <MapPin className="w-4 h-4 mr-2" />
           <span>Explore: All Locations</span>
         </div>
      );
    }
    
    // Fallback if no locations or 1 location
    return (
      <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
         <Home className="w-4 h-4 mr-2" />
         <span>{user?.district || 'My Neighborhood'}</span>
      </div>
    );
  }

  const activeLocation = user.locations.find(l => l.id === user.activeLocationId) || user.locations[0];

  const getIcon = (type: string) => {
    switch (type) {
      case 'HOME': return <Home className="w-4 h-4" />;
      case 'WORK': return <Briefcase className="w-4 h-4" />;
      case 'VACATION': return <MapPin className="w-4 h-4" />;
      case 'PARENTS': return <Users className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <Button 
        variant="outline" 
        className="w-full flex justify-between items-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          {getIcon(activeLocation.type)}
          <span className="truncate max-w-[100px]">{activeLocation.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 ml-2" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-black/10 dark:border-white/10 overflow-hidden z-50">
          <div className="p-2 space-y-1">
            {user.locations.map(loc => (
              <button
                key={loc.id}
                onClick={() => {
                  switchLocation(loc.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                  activeLocation.id === loc.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {getIcon(loc.type)}
                  <span>{loc.name}</span>
                </div>
                {activeLocation.id === loc.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
