import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Pause, Play, BadgeCheck } from 'lucide-react';
import { Input } from './ui/input';
import { t } from '../lib/i18n';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useLanguageStore } from '../store/useLanguageStore';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

export default function MomentViewer({ moments, initialIndex, onClose }: { moments: any[], initialIndex: number, onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { language } = useLanguageStore();
  const { user } = useAuthStore();
  const isGuest = user?.role === 'guest';
  const navigate = useNavigate();
  const { openOrCreateChat } = useChatStore();

  const activeMoment = moments[currentIndex];

  const goNext = () => {
    setDirection(1);
    if (currentIndex < moments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    setDirection(-1);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (!isPaused && activeMoment) {
      timerRef.current = setTimeout(() => {
        goNext();
      }, 3000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentIndex, isPaused, activeMoment]);

  if (!activeMoment) return null;

  const variants = {
    enter: (direction: number) => {
      if (direction > 0) {
        return {
          y: 50,
          opacity: 0,
        };
      } else {
        // Rewinding like a fan
        return {
          x: -50,
          rotate: -15,
          opacity: 0,
        };
      }
    },
    center: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      if (direction > 0) {
        return {
          y: -50,
          opacity: 0,
        };
      } else {
        return {
          x: 50,
          rotate: 15,
          opacity: 0,
        };
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="flex items-center justify-between p-4 absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white">
            {activeMoment.avatar && !isGuest ? (
              <img src={activeMoment.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold">
                {(isGuest ? t('common.neighbor', language) : activeMoment.author).charAt(0)}
              </div>
            )}
          </div>
          <span className="text-white font-medium">{isGuest ? t('common.neighbor', language) : activeMoment.author}</span>
          {!isGuest && activeMoment.verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsPaused(!isPaused)} className="text-white hover:bg-white/20 p-2 rounded-full">
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        
        <button onClick={goPrev} className="absolute left-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60" style={{ display: currentIndex === 0 ? 'none' : 'block' }}>
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={goNext} className="absolute right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60">
          <ChevronRight className="w-8 h-8" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative max-h-full max-w-full z-10"
          >
            <img src={activeMoment.image} alt="Moment" className="max-h-full max-w-full object-contain rounded-xl" />
            {activeMoment.textOverlay && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold text-center drop-shadow-md bg-black/30 p-2 rounded whitespace-pre-wrap max-w-[80%]">
                {activeMoment.textOverlay}
              </div>
            )}
            
            {/* Reactions placed on the right side in a semi-circle */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-4">
              {['👍', '❤️', '🔥'].map((emoji, idx) => {
                // Place around circumference 
                const offsets = [
                  { x: -20, y: -60 },
                  { x: 10, y: 0 },
                  { x: -20, y: 60 }
                ];
                const pos = offsets[idx];
                return (
                  <button 
                    key={emoji}
                    className="absolute w-12 h-12 bg-black/40 hover:bg-black/60 border border-white/20 rounded-full text-2xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                    onClick={async () => {
                      if (activeMoment) {
                        try {
                          const newReactions = [...(activeMoment.reactions || []), emoji];
                          await updateDoc(doc(db, 'moments', activeMoment.id), {
                            reactions: newReactions
                          });
                        } catch (e) {}
                      }
                      goNext();
                    }}
                  >
                    {emoji}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="p-4 absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent">
        <Input 
          placeholder="Reply to moment..." 
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && replyText.trim()) {
              if (isGuest) {
                alert('Guests cannot send messages.');
                return;
              }
              openOrCreateChat(`neighbor-${activeMoment.author}`, activeMoment.author, 'neighbor');
              navigate('/chat');
              setReplyText('');
              onClose();
            }
          }}
          className="bg-white/20 border-none text-white placeholder:text-white/60" 
        />
      </div>
    </div>
  );
}
