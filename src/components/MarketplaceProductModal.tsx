import { getDeterministicChatId } from '../lib/chatUtils';
import React, { useState } from 'react';
import { X, MessageCircle, RefreshCw, HandHeart, Tag, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useNavigate } from 'react-router-dom';

export default function MarketplaceProductModal({ item, onClose }: { item: any, onClose: () => void }) {
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const { openOrCreateChat } = useChatStore();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!item || !user) return null;

  const images = item.images || [item.image];

  const handleContactSeller = () => {
    openOrCreateChat(getDeterministicChatId(user?.uid || 'guest', `neighbor-seller-${item.id}`), `Seller of ${item.title}`, 'neighbor');
    navigate('/chat');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[90vh]">
        <div className="relative h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 shrink-0">
          <img src={images[currentImageIndex]} alt={item.title} className="w-full h-full object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 z-10 transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1); }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1); }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_: any, idx: number) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}
          
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider">
            {item.category}
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h2>
              <span className={`text-xl font-bold whitespace-nowrap ml-4 ${
                item.type === 'giveaway' ? 'text-green-500' : 
                item.type === 'lend' ? 'text-blue-500' : 'text-orange-500'
              }`}>
                {item.price}
              </span>
            </div>
            <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 space-x-4">
              <div className="flex items-center">
                {item.type === 'lend' ? <RefreshCw className="h-4 w-4 mr-1.5" /> :
                 item.type === 'giveaway' ? <HandHeart className="h-4 w-4 mr-1.5" /> :
                 <Tag className="h-4 w-4 mr-1.5" />}
                <span className="capitalize">{t(('market.' + item.type) as any, language)}</span>
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4 mr-1" />
                {item.distance} away
              </div>
            </div>
          </div>
          
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {item.description || "This neighbor hasn't provided a detailed description. Please contact them for more info."}
          </div>

          
            <Button onClick={handleContactSeller} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg">
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Seller
          </Button>
        </div>
      </div>
    </div>
  );
}
