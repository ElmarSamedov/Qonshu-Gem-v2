const fs = require('fs');

const content = `import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { HeartHandshake, MapPin, Clock, Plus, X, MessageCircle, BadgeCheck } from 'lucide-react';
import VerificationGate from './VerificationGate';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import GoodDeedsRegistry from './GoodDeedsRegistry';

export default function MutualAid() {
  const { user } = useAuthStore();
  const isGuest = user?.role === 'guest';
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState<{title: string; description: string; type: 'borrow' | 'service'}>({ title: '', description: '', type: 'service' });
  const { language } = useLanguageStore();
  const { openOrCreateChat } = useChatStore();
  const navigate = useNavigate();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [resolveDialogReq, setResolveDialogReq] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'requests' | 'registry'>('requests');

  React.useEffect(() => {
    const q = query(collection(db, 'mutual_aid_requests'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setRequests(list);
    });
    return unsub;
  }, []);

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.title || !newRequest.description || !user) return;
    
    try {
      await addDoc(collection(db, 'mutual_aid_requests'), {
        title: newRequest.title,
        description: newRequest.description,
        type: newRequest.type,
        author: user.name,
        authorId: user.uid,
        verified: user.verified || false,
        district: user.district || 'Unknown',
        status: 'open',
        timestamp: serverTimestamp(),
        responders: []
      });
      setNewRequest({ title: '', description: '', type: 'service' });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const submitResolve = async (helperId: string) => {
    if (!resolveDialogReq || !user) return;
    try {
      const res = await fetch('/api/mutual-aid/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: resolveDialogReq.id,
          helperId,
          recipientId: user.uid,
          district: user.district || 'Unknown',
          category: resolveDialogReq.type
        })
      });
      if (res.ok) {
        setResolveDialogReq(null);
      }
    } catch (e) {
      console.error("Resolve error:", e);
    }
  };

  const handleOfferHelp = async (req: any) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'mutual_aid_requests', req.id), {
        responders: arrayUnion({ uid: user.uid, name: user.name })
      });
    } catch(e) {}
    openOrCreateChat(\`neighbor-\${req.authorId}\`, req.author, 'neighbor');
    navigate('/chat');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/20 rounded-lg border border-rose-500/30">
            <HeartHandshake className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('aid.title', language)}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('aid.subtitle', language)}</p>
          </div>
        </div>
        <div className="flex bg-black/5 dark:bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode('requests')}
            className={\`px-3 py-1.5 text-sm font-medium rounded-md transition-colors \${viewMode === 'requests' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
          >
            Requests
          </button>
          <button
            onClick={() => setViewMode('registry')}
            className={\`px-3 py-1.5 text-sm font-medium rounded-md transition-colors \${viewMode === 'registry' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}\`}
          >
            Registry
          </button>
        </div>
      </div>

      {viewMode === 'registry' ? (
        <GoodDeedsRegistry />
      ) : (
      <>
      <VerificationGate>
        {!showForm ? (
          <Card className="glass-panel border-dashed border-2 border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 shadow-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">{t('aid.need_hand', language)}</h3>
              <Button onClick={() => setShowForm(true)} size="sm" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white border-none shadow-lg shadow-rose-500/20">
                <Plus className="mr-2 h-4 w-4" /> {t('aid.ask_help', language)}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel border-black/20 dark:border-white/20 bg-white/60 dark:bg-black/40 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg text-slate-900 dark:text-white">{t('aid.new_req', language)}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('aid.req_type', language)}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewRequest({...newRequest, type: 'service'})}
                      className={\`py-2 rounded-lg border text-sm font-medium transition-all \${
                        newRequest.type === 'service' 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                          : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:bg-white/5'
                      }\`}
                    >
                      {t('aid.service', language)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRequest({...newRequest, type: 'borrow'})}
                      className={\`py-2 rounded-lg border text-sm font-medium transition-all \${
                        newRequest.type === 'borrow' 
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                          : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:bg-white/5'
                      }\`}
                    >
                      {t('aid.borrow', language)}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('aid.form_title', language)}</label>
                  <Input 
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    placeholder="E.g., Need help moving a sofa"
                    className="bg-white/40 dark:bg-black/20 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('aid.form_desc', language)}</label>
                  <textarea 
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    placeholder="Provide details about what you need..."
                    className="w-full h-24 rounded-md bg-white/40 dark:bg-black/20 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-500 text-white">
                  {t('aid.post_req', language)}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </VerificationGate>

      <div className="space-y-4">
        {requests.map(req => (
          <Card key={req.id} className={\`glass-panel border-black/10 dark:border-white/10 overflow-hidden \${req.status === 'fulfilled' ? 'opacity-60' : ''}\`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={\`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border \${
                      req.type === 'borrow' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }\`}>
                      {req.type}
                    </span>
                    {req.status === 'fulfilled' && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        {t('aid.fulfilled', language)}
                      </span>
                    )}
                  </div>
                  <CardTitle className={\`text-lg mt-1 \${req.status === 'fulfilled' ? 'text-slate-600 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}\`}>
                    {req.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{req.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span className="text-slate-700 dark:text-slate-300 mr-1">{isGuest ? t('common.neighbor', language) : req.author}</span>
                    {!isGuest && req.verified && <BadgeCheck className="h-3 w-3 text-blue-500 mr-2" />}
                  </div>
                  {!isGuest && (
                    <>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 font-medium">
                        <MapPin className="h-3 w-3 mr-1" />
                        {req.distance} {t('aid.away', language) || 'away'}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 font-medium">
                        <Clock className="h-3 w-3 mr-1" />
                        {req.timestamp && typeof req.timestamp.toDate === 'function' ? new Date(req.timestamp.toDate()).toLocaleDateString() : 'Just now'}
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {req.status === 'open' && !isGuest && req.authorId !== user?.uid && (
                    <Button variant="outline" size="sm" onClick={() => handleOfferHelp(req)} className="bg-black/5 dark:bg-white/5 text-rose-400 border-rose-400/30 hover:bg-rose-500/20">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t('aid.offer_help', language) || 'Offer Help'}
                    </Button>
                  )}
                  {req.status === 'open' && req.authorId === user?.uid && (
                    <Button variant="default" size="sm" onClick={() => setResolveDialogReq(req)} className="bg-green-600 hover:bg-green-500 text-white">
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </>
      )}

      {/* Resolve Dialog */}
      {resolveDialogReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-black/10 dark:border-white/10 shadow-2xl">
            <CardHeader className="border-b border-black/5 dark:border-white/5">
              <CardTitle>Who helped you?</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Select a neighbor who helped you with "{resolveDialogReq.title}". They will receive points!
              </p>
              
              {resolveDialogReq.responders && resolveDialogReq.responders.length > 0 ? (
                <div className="space-y-2">
                  {resolveDialogReq.responders.map((r: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => submitResolve(r.uid)}
                      className="w-full p-3 text-left bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors flex items-center"
                    >
                      <HeartHandshake className="w-4 h-4 mr-3 text-rose-400" />
                      <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-amber-600 dark:text-amber-400 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  No one has officially offered help via the app yet. If someone helped you in person, they need to click "Offer Help" on this request to receive points.
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <Button variant="ghost" onClick={() => setResolveDialogReq(null)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync('src/components/MutualAid.tsx', content);
console.log("Rewrote MutualAid.tsx");
