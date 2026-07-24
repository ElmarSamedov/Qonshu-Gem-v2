import { getDeterministicChatId } from '../lib/chatUtils';
import React, { useEffect, useState, useRef } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { Bell, X, Hand, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useInterestsStore } from '../store/useInterestsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';
import { getDoc } from 'firebase/firestore';

export default function Notifications() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { interests, fetchInterests } = useInterestsStore();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const { openOrCreateChat } = useChatStore();
  const [signaledIds, setSignaledIds] = useState<Set<string>>(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  useEffect(() => {
    if (interests.length === 0 && notifications.some(n => n.interestIds)) {
      fetchInterests();
    }
  }, [notifications, fetchInterests]);

  const getInterestNames = (ids: string[]) => {
    if (!interests || interests.length === 0) return ids.join(', ');
    return ids.map(id => {
      const match = interests.find(i => i.id === id);
      if (!match) return id;
      if (language === 'ru') return match.interest_ru || match.interest_en;
      if (language === 'az') return match.interest_az || match.interest_en;
      return match.interest_en;
    }).join(', ');
  };

  useEffect(() => {
    if (!user || user.role === 'guest') return;
    
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(list);
    }, (err) => console.error('Notifications snapshot error:', err));

    return unsub;
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const markAllAsRead = () => {
    notifications.filter(n => !n.read).forEach(n => markAsRead(n.id));
  };

  const handleWave = async (notif: any) => {
    if (!user || !notif.matchedUserId) return;
    try {
      const res = await fetch('/api/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUid: user.uid,
          toUid: notif.matchedUserId
        })
      });
      const data = await res.json();
      
      setSignaledIds(prev => new Set(prev).add(notif.id));
      
      if (data.matched) {
        openOrCreateChat(getDeterministicChatId(user?.uid || 'guest', `neighbor-${notif.matchedUserId}`), 'Neighbor', 'neighbor');
        navigate('/chat');
        markAsRead(notif.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenChat = (notif: any) => {
    if (!notif.matchedUserId) return;
    openOrCreateChat(getDeterministicChatId(user?.uid || 'guest', `neighbor-${notif.matchedUserId}`), 'Neighbor', 'neighbor');
    navigate('/chat');
    markAsRead(notif.id);
  };

  
  const handleAcceptContact = async (notif: any) => {
    if (!user || !notif.requesterUid) return;
    try {
      // Add requester to current user's contact list
      const userRef = doc(db, 'users', user.uid);
      const requesterRef = doc(db, 'users', notif.requesterUid);
      
      const userSnap = await getDoc(userRef);
      const requesterSnap = await getDoc(requesterRef);
      
      if (requesterSnap.exists()) {
        const requesterData = requesterSnap.data();
        let safetyCheckIn = requesterData.safetyCheckIn || {};
        let contactUids = safetyCheckIn.contactUids || [];
        let pending = safetyCheckIn.pendingContactUids || [];
        
        if (!contactUids.includes(user.uid)) contactUids.push(user.uid);
        pending = pending.filter((id: string) => id !== user.uid);
        
        safetyCheckIn.contactUids = contactUids;
        safetyCheckIn.pendingContactUids = pending;
        
        await updateDoc(requesterRef, { safetyCheckIn });
      }
      
      markAsRead(notif.id);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadNotifs = notifications.filter(n => !n.read);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
      >
        <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
        {unreadNotifs.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 lg:left-0 mt-2 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/15 dark:border-white/15 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadNotifs.length > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold">Mark all as read</button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-black/5 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No notifications yet.</div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} className={`p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-indigo-500/10 dark:bg-indigo-500/20' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-bold ${!notif.read ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-950 dark:text-white'}`}>{notif.title}</h4>
                    {!notif.read && (
                      <button onClick={() => markAsRead(notif.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {notif.message}
                    {notif.interestIds && notif.interestIds.length > 0 && (
                      <span className="block font-medium mt-1 text-indigo-600 dark:text-indigo-400">
                        Shared interests: {getInterestNames(notif.interestIds)}
                      </span>
                    )}
                  </p>
                  
                  {notif.type === 'interest_match' && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleWave(notif)}
                        disabled={signaledIds.has(notif.id)}
                        className="flex-1 flex justify-center items-center text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors disabled:opacity-50"
                      >
                        <Hand className="w-3 h-3 mr-1.5" /> {signaledIds.has(notif.id) ? 'Signaled' : 'Wave hello'}
                      </button>
                      <button
                        onClick={() => handleOpenChat(notif)}
                        className="flex-1 flex justify-center items-center text-xs border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 mr-1.5" /> Message
                      </button>
                    </div>
                  )}

                  {notif.type === 'mutual_signal_match' && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleOpenChat(notif)}
                        className="flex items-center justify-center w-full text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 mr-1.5" /> Start Chat
                      </button>
                    </div>
                  )}

                  {notif.type === 'safety_contact_request' && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleAcceptContact(notif)}
                        className="flex-1 flex justify-center items-center text-xs bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="flex-1 flex justify-center items-center text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
