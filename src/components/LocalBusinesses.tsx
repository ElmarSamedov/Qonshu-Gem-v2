import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Store, MapPin, Search, CheckCircle2, Navigation, Clock, Coffee, ShoppingBag, Palette, BadgeCheck, Lock } from 'lucide-react';
import VerificationGate from './VerificationGate';
import { Input } from './ui/input';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface Business {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  distance: string;
  isOpen: boolean;
  contact: string;
}

export default function LocalBusinesses() {
  const { user } = useAuthStore();
  const isGuest = user?.role === 'guest';
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguageStore();
  const { openOrCreateChat } = useChatStore();
  const navigate = useNavigate();
  
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: 1,
      name: 'Baku Roasters Cafe',
      category: 'Cafe',
      description: 'Artisan coffee roasted locally. Fresh pastries daily.',
      address: '28 May St, near Block 14',
      distance: '150m',
      isOpen: true,
      contact: '+994 50 111 22 33'
    },
    {
      id: 2,
      name: 'Nizami Artisanal Bakery',
      category: 'Bakery',
      description: 'Sourdough bread, traditional sweets, and custom cakes.',
      address: 'Nizami St, corner of Fountain Square',
      distance: '300m',
      isOpen: true,
      contact: '+994 55 444 55 66'
    },
    {
      id: 3,
      name: 'Handcrafted by Leyla',
      category: 'Artisan',
      description: 'Handmade ceramic mugs and plates. Perfect for gifts.',
      address: 'Khagani St 42',
      distance: '500m',
      isOpen: false,
      contact: '+994 70 777 88 99'
    }
  ]);

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cafe':
        return <Coffee className="h-5 w-5 text-amber-400" />;
      case 'bakery':
        return <ShoppingBag className="h-5 w-5 text-orange-400" />;
      case 'artisan':
        return <Palette className="h-5 w-5 text-purple-400" />;
      default:
        return <Store className="h-5 w-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('business.title', language)}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('business.subtitle', language)}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 dark:text-slate-400" />
        <Input 
          className="pl-10 bg-white/60 dark:bg-black/40 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 w-full" 
          placeholder={t('business.search', language)} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isGuest && (
        <Card className="glass-panel border-indigo-500/20 bg-indigo-500/5 mb-4">
          <CardContent className="p-4 text-center space-y-2">
            <Lock className="h-5 w-5 text-indigo-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('business.locked', language)}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {t('business.locked_desc', language)}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredBusinesses.map(business => (
          <Card key={business.id} className="glass-panel border-black/10 dark:border-white/10 hover:border-black/20 dark:border-white/20 transition-all shadow-xl group">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 group-hover:bg-black/10 dark:bg-white/10 transition-colors">
                    {getCategoryIcon(business.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{business.name}</h3>
                      <div title={t('business.verified_acc', language)}>
                        <BadgeCheck className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
                        {business.category}
                      </span>
                      {business.isOpen ? (
                        <span className="text-emerald-400 font-medium">{t('common.open', language)}</span>
                      ) : (
                        <span className="text-rose-400 font-medium">{t('common.closed', language)}</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">"{business.description}"</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4 mr-1.5" />
                        {business.address} ({business.distance})
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {isGuest ? (
                    <Button disabled className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed text-xs flex items-center justify-center">
                      <Lock className="w-3.5 h-3.5 mr-1" /> {t('common.visit', language)}
                    </Button>
                  ) : (
                    <VerificationGate compact={true}>
                      <Button variant="outline" onClick={() => { openOrCreateChat(`business-${business.id}`, business.name, 'business'); navigate('/chat'); }} className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white">
                        {t('common.visit', language)}
                      </Button>
                    </VerificationGate>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name + ' ' + business.address)}`;
                      window.open(url, '_blank');
                    }}
                    className="h-9 w-9 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 self-end" 
                    disabled={isGuest}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">{t('business.no_results', language)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
