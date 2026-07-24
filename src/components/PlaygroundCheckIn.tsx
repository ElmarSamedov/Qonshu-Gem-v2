import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { db } from '../lib/firebase';
import { collection, doc, updateDoc, onSnapshot, query, where, setDoc } from 'firebase/firestore';

export default function PlaygroundCheckIn() {
  const { user } = useAuthStore();
  const [activeCount, setActiveCount] = useState(0);
  const [amIThere, setAmIThere] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Listen to playground check-ins
    const q = query(collection(db, 'playground_checkins'), where('district', '==', user.district || 'Sabail'));
    const unsub = onSnapshot(q, (snapshot) => {
      let count = 0;
      let me = false;
      const now = Date.now();
      snapshot.forEach(d => {
        const data = d.data();
        // Check-in expires after 2 hours
        if (data.timestamp && (now - data.timestamp < 2 * 60 * 60 * 1000)) {
          if (data.verified) {
            count++;
          }
          if (d.id === user.uid) {
            me = true;
          }
        }
      });
      setActiveCount(count);
      setAmIThere(me);
    });

    return () => unsub();
  }, [user]);

  const toggleCheckIn = async () => {
    if (!user) return;
    try {
      const ref = doc(db, 'playground_checkins', user.uid);
      if (amIThere) {
        // Remove or expire
        await updateDoc(ref, { timestamp: 0 });
      } else {
        await setDoc(ref, {
          district: user.district || 'Sabail',
          timestamp: Date.now(),
          verified: user.is_verified || false
        }, { merge: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="glass-panel border-indigo-500/20 mb-6 shadow-xl relative overflow-hidden">
      <CardHeader className="pb-3 border-b border-black/5 dark:border-white/5">
        <CardTitle className="text-lg font-bold flex items-center justify-between text-slate-900 dark:text-white">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-500" />
            <span>Yard for Children</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {activeCount} verified {activeCount === 1 ? 'family is' : 'families are'} currently at the playground.
            </p>
            <p className="text-xs text-slate-500">
              Aggregated for privacy. Check in to let neighbors know!
            </p>
          </div>
        </div>
        <button
          onClick={toggleCheckIn}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-md ${amIThere ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'}`}
        >
          {amIThere ? 'Check Out' : 'I am at the Playground'}
        </button>
      </CardContent>
    </Card>
  );
}
