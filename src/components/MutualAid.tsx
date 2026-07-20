import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { HeartHandshake, MapPin, Clock, Plus, X, MessageCircle, BadgeCheck } from 'lucide-react';
import VerificationGate from './VerificationGate';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';

interface HelpRequest {
  id: number;
  title: string;
  description: string;
  author: string;
  verified?: boolean;
  type: 'borrow' | 'service';
  distance: string;
  time: string;
  status: 'open' | 'fulfilled';
}

export default function MutualAid() {
  const [showForm, setShowForm] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '', type: 'service' as const });
  const { language } = useLanguageStore();
  const { openOrCreateChat } = useChatStore();
  const navigate = useNavigate();

  const handleOfferHelp = (req: HelpRequest) => {
    openOrCreateChat(`neighbor-${req.author}`, req.author, 'neighbor');
    navigate('/chat');
  };

  
  const [requests, setRequests] = useState<HelpRequest[]>([
    {
      id: 1,
      title: 'Need a power drill for 30 mins',
      description: 'Hanging a couple of shelves in the living room. Just need a drill and maybe a 6mm masonry bit. Can pick up and return immediately.',
      author: 'Togrul K.',
      verified: true,
      type: 'borrow',
      distance: '50m',
      time: '1 hour ago',
      status: 'open'
    },
    {
      id: 2,
      title: 'Watering plants next week',
      description: 'I\'ll be on vacation from the 10th to the 17th. Looking for a neighbor to water my balcony plants twice while I\'m away.',
      author: 'Aysel H.',
      verified: false,
      type: 'service',
      distance: '150m',
      time: '4 hours ago',
      status: 'open'
    },
    {
      id: 3,
      title: 'Lost cat - orange tabby',
      description: 'Our cat Leo slipped out last night around Block 4. He is wearing a blue collar. Please let us know if you see him!',
      author: 'Farid M.',
      verified: true,
      type: 'service',
      distance: '300m',
      time: '5 hours ago',
      status: 'open'
    },
    {
      id: 4,
      title: 'Need help moving a sofa',
      description: 'Just need one extra pair of hands to move a sofa from the 3rd floor to the ground floor. Will take 10 minutes.',
      author: 'Nigar R.',
      verified: false,
      type: 'service',
      distance: '100m',
      time: '1 day ago',
      status: 'fulfilled'
    }
  ]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequest.title || !newRequest.description) return;
    
    setRequests([
      {
        id: Date.now(),
        ...newRequest,
        author: 'Current User',
        distance: '0m',
        time: 'Just now',
        status: 'open'
      },
      ...requests
    ]);
    setShowForm(false);
    setNewRequest({ title: '', description: '', type: 'service' });
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
      </div>

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
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        newRequest.type === 'service' 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                          : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:bg-white/5'
                      }`}
                    >
                      {t('aid.service', language)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRequest({...newRequest, type: 'borrow'})}
                      className={`py-2 rounded-lg border text-sm font-medium transition-all ${
                        newRequest.type === 'borrow' 
                          ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                          : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:bg-white/5'
                      }`}
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
          <Card key={req.id} className={`glass-panel border-black/10 dark:border-white/10 overflow-hidden ${req.status === 'fulfilled' ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${
                      req.type === 'borrow' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {req.type}
                    </span>
                    {req.status === 'fulfilled' && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        {t('aid.fulfilled', language)}
                      </span>
                    )}
                  </div>
                  <CardTitle className={`text-lg mt-1 ${req.status === 'fulfilled' ? 'text-slate-600 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
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
                    <span className="text-slate-700 dark:text-slate-300 mr-1">{req.author}</span>
                    {req.verified && <BadgeCheck className="h-3 w-3 text-blue-500 mr-2" />}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 font-medium">
                    <MapPin className="h-3 w-3 mr-1" />
                    {req.distance} {t('aid.away', language)}
                  </div>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-500 font-medium">
                    <Clock className="h-3 w-3 mr-1" />
                    {req.time}
                  </div>
                </div>
                
                {req.status === 'open' && (
                  <Button variant="outline" size="sm" onClick={() => handleOfferHelp(req)} className="bg-black/5 dark:bg-white/5 text-rose-400 border-rose-400/30 hover:bg-rose-500/20">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('aid.offer_help', language)}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
