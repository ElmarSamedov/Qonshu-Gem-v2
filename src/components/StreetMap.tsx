import React, { useState, useMemo } from 'react';
import { MapPin, MessageSquare, AlertTriangle, Info, MessageCircle, X } from 'lucide-react';

interface StreetMapProps {
  posts: any[];
}

export default function StreetMap({ posts }: StreetMapProps) {
  const [selectedGroup, setSelectedGroup] = useState<any[] | null>(null);

  // Simple string hash function
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Group posts by a simulated "location" on the street
  const groups = useMemo(() => {
    const grouped = new Map<number, any[]>();
    
    posts.forEach(post => {
      // Use author or id to generate a pseudo-random position (0-100)
      const keyStr = post.author || post.id || '';
      const position = hashString(keyStr) % 100;
      
      // Cluster nearby positions (e.g., within 5 units)
      let foundBucket = -1;
      for (const bucket of grouped.keys()) {
        if (Math.abs(bucket - position) <= 5) {
          foundBucket = bucket;
          break;
        }
      }
      
      if (foundBucket !== -1) {
        grouped.get(foundBucket)?.push(post);
      } else {
        grouped.set(position, [post]);
      }
    });
    
    return Array.from(grouped.entries()).map(([pos, items]) => ({
      position: pos,
      items
    }));
  }, [posts]);

  // Path for the street curve
  const pathD = "M 50,50 C 300,150 700,50 950,250 C 700,450 300,350 50,450 C 200,250 800,250 950,50";

  // Given a percentage (0-100), find a point on the SVG path.
  // For simplicity since we don't have getPointAtLength here, we'll map the 0-100 
  // to a rough visual x/y coordinate mapping for the street map.
  const getCoordinates = (pos: number) => {
    // A simplified visual mapping that roughly follows a winding path
    const w = 1000;
    const h = 500;
    
    // We'll just scatter them along a pseudo-path
    const x = 50 + (pos / 100) * (w - 100);
    const y = h/2 + Math.sin(pos / 100 * Math.PI * 4) * 150;
    
    return { x, y };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'event': return <MapPin className="w-4 h-4" />;
      case 'market': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden shadow-inner">
      {/* SVG Street map */}
      <svg viewBox="0 0 1000 500" className="w-full h-full opacity-30 dark:opacity-20 pointer-events-none">
        <path 
          d="M 50,250 Q 250,50 500,250 T 950,250" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="40" 
          strokeLinecap="round"
          className="text-slate-400"
        />
        <path 
          d="M 50,250 Q 250,50 500,250 T 950,250" 
          fill="none" 
          stroke="white" 
          strokeWidth="2" 
          strokeDasharray="20 20"
        />
        {/* Buildings/Decorations */}
        <rect x="200" y="80" width="40" height="60" rx="4" fill="currentColor" className="text-slate-300" />
        <rect x="700" y="320" width="80" height="100" rx="4" fill="currentColor" className="text-slate-300" />
        <rect x="400" y="300" width="60" height="50" rx="4" fill="currentColor" className="text-slate-300" />
      </svg>

      {/* Markers */}
      <div className="absolute inset-0">
        {groups.map((group, idx) => {
          // Map to 50-950 for x
          const x = 50 + (group.position / 100) * 900;
          // Approximate Y along the quadratic curve M 50,250 Q 250,50 500,250 T 950,250
          let y = 250;
          if (x <= 500) {
            // first curve part
            const t = (x - 50) / 450;
            y = 250 * (1-t)*(1-t) + 2 * (1-t) * t * 50 + 250 * t * t;
          } else {
            const t = (x - 500) / 450;
            y = 250 * (1-t)*(1-t) + 2 * (1-t) * t * 450 + 250 * t * t;
          }

          return (
            <div 
              key={idx} 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${(x / 1000) * 100}%`, top: `${(y / 500) * 100}%` }}
              onClick={() => setSelectedGroup(group.items)}
            >
              {group.items.length === 1 ? (
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-500 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                    {group.items[0].avatar ? (
                      <img src={group.items[0].avatar} alt={group.items[0].author} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {group.items[0].author?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 border border-slate-200 dark:border-slate-700">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      group.items[0].type === 'alert' ? 'bg-red-500 text-white' : 
                      group.items[0].type === 'event' ? 'bg-green-500 text-white' :
                      'bg-indigo-500 text-white'
                    }`}>
                      {getTypeIcon(group.items[0].type)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white border-2 border-white dark:border-slate-800 flex items-center justify-center shadow-lg font-bold group-hover:scale-110 transition-transform">
                  +{group.items.length}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Group Preview */}
      {selectedGroup && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-64 overflow-hidden z-10 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Nearby Activity
            </h4>
            <button onClick={() => setSelectedGroup(null)} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-y-auto space-y-3 pr-2 scrollbar-hide">
            {selectedGroup.map(post => (
              <div key={post.id} className="flex gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-black/5 dark:border-white/5">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
                  {post.avatar ? (
                    <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                      {post.author?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{post.author}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{post.type}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
