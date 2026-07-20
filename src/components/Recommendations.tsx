import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Star, ShieldCheck, MapPin, Search, ThumbsUp, Wrench, Briefcase, GraduationCap } from 'lucide-react';
import VerificationGate from './VerificationGate';
import { Input } from './ui/input';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';

interface Recommendation {
  id: number;
  name: string;
  category: string;
  description: string;
  confirmations: number;
  contact: string;
}

export default function Recommendations() {
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useLanguageStore();
  const { openOrCreateChat } = useChatStore();
  const navigate = useNavigate();
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 1,
      name: 'Elnur Q.',
      category: 'Plumbing',
      description: 'Fixed my leaking pipe in 15 minutes. Very professional and reasonably priced.',
      confirmations: 12,
      contact: '+994 50 123 45 67'
    },
    {
      id: 2,
      name: 'Aysel Math Tutoring',
      category: 'Education',
      description: 'Helped my son with 8th grade math. His grades improved significantly.',
      confirmations: 8,
      contact: '+994 55 987 65 43'
    },
    {
      id: 3,
      name: 'Teymur Electrician',
      category: 'Electrical',
      description: 'Rewired the whole apartment. Clean work and very safe.',
      confirmations: 15,
      contact: '+994 70 555 12 34'
    },
    {
      id: 4,
      name: 'Nigar Cleaning',
      category: 'Cleaning',
      description: 'Deep cleaning service. Left my apartment spotless after renovation.',
      confirmations: 5,
      contact: '+994 51 333 44 55'
    }
  ]);

  const handleConfirm = (id: number) => {
    setRecommendations(recommendations.map(r => r.id === id ? { ...r, confirmations: r.confirmations + 1 } : r));
  };

  const filteredRecommendations = recommendations.filter(rec => 
    rec.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rec.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plumbing':
      case 'electrical':
        return <Wrench className="h-5 w-5 text-blue-400" />;
      case 'education':
        return <GraduationCap className="h-5 w-5 text-purple-400" />;
      default:
        return <Briefcase className="h-5 w-5 text-green-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('rec.title', language)}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('rec.subtitle', language)}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600 dark:text-slate-400" />
        <Input 
          className="pl-10 bg-white/60 dark:bg-black/40 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 w-full" 
          placeholder={t('rec.search', language)} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <VerificationGate>
        <div className="space-y-4">
          {filteredRecommendations.map(rec => (
            <Card key={rec.id} className="glass-panel border-black/10 dark:border-white/10 hover:border-black/20 dark:border-white/20 transition-all shadow-xl group">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 group-hover:bg-black/10 dark:bg-white/10 transition-colors">
                      {getCategoryIcon(rec.category)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{rec.name}</h3>
                      <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">"{rec.description}"</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-emerald-400 font-medium bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                          <ShieldCheck className="h-4 w-4 mr-1.5" />
                          {t('rec.confirmed_by', language)} {rec.confirmations} {rec.confirmations === 1 ? t('rec.neighbor', language) : t('rec.neighbors', language)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleConfirm(rec.id)} className="text-emerald-500 hover:bg-emerald-500/10 h-9 w-9">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => { openOrCreateChat(`neighbor-${rec.name}`, rec.name, 'neighbor'); navigate('/chat'); }} className="bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white">
                      {t('common.contact', language)}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">{t('rec.no_results', language)}</p>
            </div>
          )}
        </div>
      </VerificationGate>
    </div>
  );
}
