import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { HeartHandshake, ShoppingBag, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhatsNearbyWidget() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeAid, setActiveAid] = useState<any[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const district = user.district || 'Sabail';

        // 1. Mutual Aid (not fulfilled)
        const qAid = query(collection(db, 'mutual_aid_requests'), where('district', '==', district), limit(2));
        const snapAid = await getDocs(qAid);
        setActiveAid(snapAid.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => (d as any).status !== 'fulfilled'));

        // 2. Marketplace items
        const qMarket = query(collection(db, 'marketplace'), where('district', '==', district), orderBy('createdAt', 'desc'), limit(2));
        const snapMarket = await getDocs(qMarket);
        setMarketplaceItems(snapMarket.docs.map(d => ({ id: d.id, ...d.data() })));

        // 3. Events (future events are tricky without composite indexes if we sort by date, so we'll just grab a few and filter)
        // For simplicity, we just fetch a couple of events
        // If we don't have events collection we can skip or use mock fallback
        const qEvents = query(collection(db, 'events'), limit(2));
        const snapEvents = await getDocs(qEvents);
        setUpcomingEvents(snapEvents.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (e) {
        console.error("Error fetching nearby data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  if (loading) return null;
  if (!activeAid.length && !marketplaceItems.length && !upcomingEvents.length) return null;

  return (
    <Card className="glass-panel border-indigo-500/20 mb-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
      <CardHeader className="pb-3 border-b border-black/5 dark:border-white/5">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
          <span>What's Nearby Now</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Mutual Aid */}
        <div 
          onClick={() => navigate('/mutual-aid')}
          className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-800/30 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400">
            <HeartHandshake className="w-5 h-5" />
            <span className="font-semibold text-sm">Help Needed</span>
          </div>
          {activeAid.length > 0 ? (
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              {activeAid.slice(0,2).map(req => (
                <li key={req.id} className="truncate">• {req.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">No active requests.</p>
          )}
        </div>

        {/* Marketplace */}
        <div 
          onClick={() => navigate('/marketplace')}
          className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold text-sm">Marketplace</span>
          </div>
          {marketplaceItems.length > 0 ? (
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              {marketplaceItems.slice(0,2).map(item => (
                <li key={item.id} className="truncate">• {item.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">No new items.</p>
          )}
        </div>

        {/* Events */}
        <div 
          onClick={() => navigate('/events')}
          className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-100 dark:border-amber-800/30 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold text-sm">Upcoming</span>
          </div>
          {upcomingEvents.length > 0 ? (
            <ul className="text-sm space-y-1 text-slate-700 dark:text-slate-300">
              {upcomingEvents.slice(0,2).map(evt => (
                <li key={evt.id} className="truncate">• {evt.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">No upcoming events.</p>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
