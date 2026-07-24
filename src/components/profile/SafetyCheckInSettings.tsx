import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';


import { HeartPulse, Search, UserPlus, Check, X, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export default function SafetyCheckInSettings() {
  const { user, updateUser } = useAuthStore();
  const [enabled, setEnabled] = useState(user?.safetyCheckIn?.enabled || false);
  const [deadlineTime, setDeadlineTime] = useState(user?.safetyCheckIn?.deadlineTime || '18:00');
  
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    if (user?.safetyCheckIn?.contactUids?.length) {
      // Mock fetch contacts
      setContacts(user.safetyCheckIn.contactUids.map(uid => ({ id: uid, name: 'Neighbor ' + uid.substring(0, 4), phone: '...' })));
    }
  }, [user?.safetyCheckIn?.contactUids]);

  const handleSave = () => {
    updateUser({
      safetyCheckIn: {
        ...(user?.safetyCheckIn || { contactUids: [], pendingContactUids: [] }),
        enabled,
        deadlineTime
      }
    });
  };

  const handleSearch = async () => {
    if (!searchPhone) return;
    setIsSearching(true);
    try {
      const q = query(collection(db, 'users'), where('phone', '==', searchPhone));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setSearchResult({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } else {
        setSearchResult(null);
      }
    } catch (e) {
      console.error(e);
    }
    setIsSearching(false);
  };

  const handleAddContact = async (contactId: string) => {
    // Send request via API
    await fetch('/api/safety/request-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contactUid: contactId,
        requesterUid: user?.uid,
        requesterName: user?.name
      })
    });
    
    // Update local state optimistically
    const currentPending = user?.safetyCheckIn?.pendingContactUids || [];
    updateUser({
      safetyCheckIn: {
        ...(user?.safetyCheckIn || { enabled: false, deadlineTime: '18:00', contactUids: [] }),
        pendingContactUids: [...currentPending, contactId]
      }
    });
    setSearchResult(null);
    setSearchPhone('');
  };

  const handleRemoveContact = (contactId: string) => {
     const current = user?.safetyCheckIn?.contactUids || [];
     updateUser({
      safetyCheckIn: {
        ...(user?.safetyCheckIn || { enabled: false, deadlineTime: '18:00', pendingContactUids: [] }),
        contactUids: current.filter(id => id !== contactId)
      }
    });
  };

  if (!user) return null;

  return (
    <Card className="glass-panel border-rose-500/20 dark:border-rose-400/20 mb-6">
      <CardHeader className="border-b border-white/5 pb-4 bg-rose-50 dark:bg-rose-900/10 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartPulse className="h-5 w-5 text-rose-500" />
            <CardTitle className="text-lg text-slate-900 dark:text-white">Mutual "Check Me" Insurance</CardTitle>
          </div>
          <button 
            type="button"
            onClick={() => { setEnabled(!enabled); handleSave(); }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${enabled ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm leading-relaxed">
          <ShieldAlert className="inline h-4 w-4 mr-1 text-amber-500" />
          <strong>Disclaimer:</strong> This is a neighborhood service, NOT a professional emergency response. Do not use this as a replacement for medical or emergency services.
        </p>
      </CardHeader>
      <CardContent className="p-4 space-y-6 pt-6">
        
        <div className="space-y-3">
          <label className="text-slate-700 dark:text-slate-300">Daily Check-in Deadline</label>
          <div className="flex space-x-3">
             <Input 
              type="time" 
              value={deadlineTime} 
              onChange={(e) => setDeadlineTime(e.target.value)}
              disabled={!enabled}
              className="bg-white/50 dark:bg-black/20 max-w-[150px]"
            />
            <Button onClick={handleSave} disabled={!enabled} variant="outline">Save</Button>
          </div>
          <p className="text-xs text-slate-500">If you don't tap "I'm OK" before this time, we'll gently notify your selected contacts to check on you.</p>
        </div>

        
        <div className="space-y-3 border-t border-black/5 dark:border-white/5 pt-4">
          <label className="text-slate-700 dark:text-slate-300">Requests to become a Contact</label>
          <div className="space-y-2">
            {/* The incoming requests will be handled by the Notifications dropdown */}
            <p className="text-sm text-slate-500 italic">Check your notifications bell for incoming requests.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
