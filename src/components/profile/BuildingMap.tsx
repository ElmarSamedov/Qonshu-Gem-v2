import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User, BadgeCheck, Lock } from 'lucide-react';

export default function BuildingMap({ neighbors }: { neighbors: any[] }) {
  const { user } = useAuthStore();
  const isGuest = user?.role === 'guest';
  
  // Simulated building structure (3 floors, 2 apartments per floor)
  const structure = [
    { floor: 3, apts: ['3A', '3B'] },
    { floor: 2, apts: ['2A', '2B'] },
    { floor: 1, apts: ['1A', '1B'] },
  ];

  // Map simulated neighbor data to apartments
  const neighborMapping: Record<string, any> = {
    '1A': { name: user?.name, isMe: true, verified: user?.is_verified },
    '1B': neighbors[0] ? { name: neighbors[0].name, verified: true } : null,
    '2B': neighbors[1] ? { name: neighbors[1].name, verified: true } : null,
  };

  if (isGuest) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-8 border border-black/5 dark:border-white/5 flex flex-col items-center text-center">
        <Lock className="w-8 h-8 text-indigo-400 mb-3" />
        <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Building Map Locked</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Visual building maps and precise neighbor locations are only visible to verified residents.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-black/5 dark:border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <div className="text-4xl font-black">ENTRANCE A</div>
      </div>
      
      <div className="space-y-4 max-w-sm mx-auto relative z-10">
        {structure.map(level => (
          <div key={level.floor} className="flex justify-between items-center space-x-4">
            <div className="text-xs font-bold text-slate-400 w-8 text-right shrink-0">FL {level.floor}</div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              {level.apts.map(apt => {
                const occupant = neighborMapping[apt];
                
                return (
                  <div 
                    key={apt} 
                    className={`
                      relative p-3 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md
                      ${occupant?.isMe 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' 
                        : occupant 
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }
                    `}
                  >
                    <div className="text-xs font-black text-slate-300 dark:text-slate-600 mb-2">{apt}</div>
                    
                    {occupant ? (
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${occupant.isMe ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                          {occupant.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {occupant.isMe ? 'You' : occupant.name}
                        </span>
                        {occupant.verified && <BadgeCheck className="w-3 h-3 text-blue-500 shrink-0" />}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 font-medium">Empty / Unverified</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Elevator Shaft / Ground */}
        <div className="flex justify-between items-center space-x-4 pt-4 border-t-4 border-slate-300 dark:border-slate-700">
          <div className="text-xs font-bold text-slate-400 w-8 text-right shrink-0">GR</div>
          <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded p-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Main Lobby
          </div>
        </div>
      </div>
    </div>
  );
}
