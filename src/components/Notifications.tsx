import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import { Bell, X, Hand, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useInterestsStore } from '../store/useInterestsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store/useChatStore';

export default function Notifications() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const { interests, fetchInterests } = useInterestsStore();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const { openOrCreateChat } = useChatStore();
  const [signaledIds, setSignaledIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const needsInterests = notifications.some(n => !n.read && n.interestIds && n.interestIds.length > 0);
    if (needsInterests) {
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
      limit(10)
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
        openOrCreateChat(`neighbor-${notif.matchedUserId}`, 'Neighbor', 'neighbor');
        navigate('/chat');
        markAsRead(notif.id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenChat = (notif: any) => {
    if (!notif.matchedUserId) return;
    openOrCreateChat(`neighbor-${notif.matchedUserId}`, 'Neighbor', 'neighbor');
    navigate('/chat');
    markAsRead(notif.id);
  };

  const unreadNotifs = notifications.filter(n => !n.read);
  if (unreadNotifs.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
      <AnimatePresence>
        {unreadNotifs.map(notif => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/50 flex gap-3 relative"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full h-fit text-indigo-600 dark:text-indigo-400">
              <Bell className="w-5 h-5" />
            </div>
            
            <div className="flex-1 pr-6">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{notif.title}</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {notif.message}
                {notif.interestIds && notif.interestIds.length > 0 && (
                  <span className="block font-medium mt-1 text-indigo-600 dark:text-indigo-400">
                    {getInterestNames(notif.interestIds)}
                  </span>
                )}
              </p>

              {notif.type === 'interest_match' && (
                <div className="mt-3">
                  {!signaledIds.has(notif.id) ? (
                    <button
                      onClick={() => handleWave(notif)}
                      className="flex items-center text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      <span className="mr-2 text-base">👋</span> Send a silent wave
                    </button>
                  ) : (
                    <span className="text-sm text-slate-500 italic">
                      Wave sent! They'll be notified if they wave back.
                    </span>
                  )}
                </div>
              )}

              {notif.type === 'mutual_signal_match' && (
                <div className="mt-3">
                  <button
                    onClick={() => handleOpenChat(notif)}
                    className="flex items-center text-sm bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" /> Start Chat
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => markAsRead(notif.id)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
