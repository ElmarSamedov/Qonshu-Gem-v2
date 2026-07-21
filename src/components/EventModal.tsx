import React from 'react';
import { X, Calendar as CalendarIcon, Users, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';
import { t } from '../lib/i18n';
import { useLanguageStore } from '../store/useLanguageStore';

export default function EventModal({ event, onClose, onRsvp }: { event: any, onClose: () => void, onRsvp: (eventId: string, status: 'coming' | 'not_going' | 'maybe') => void }) {
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  if (!event || !user) return null;

  const comingCount = event.attendees?.length || 0;
  const notGoingCount = event.notGoing?.length || 0;
  const maybeCount = event.maybe?.length || 0;

  const isComing = event.attendees?.includes(user.uid);
  const isNotGoing = event.notGoing?.includes(user.uid);
  const isMaybe = event.maybe?.includes(user.uid);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-black/10 dark:border-white/10">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate pr-4">{event.title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-slate-900 dark:text-white">RSVP</h4>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className={`flex flex-col items-center h-auto py-3 space-y-1 ${isComing ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : ''}`}
                onClick={() => onRsvp(event.id, 'coming')}
              >
                <CheckCircle2 className={`w-5 h-5 ${isComing ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span className="text-xs">Coming ({comingCount})</span>
              </Button>
              <Button 
                variant="outline" 
                className={`flex flex-col items-center h-auto py-3 space-y-1 ${isMaybe ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : ''}`}
                onClick={() => onRsvp(event.id, 'maybe')}
              >
                <HelpCircle className={`w-5 h-5 ${isMaybe ? 'text-amber-500' : 'text-slate-400'}`} />
                <span className="text-xs">Maybe ({maybeCount})</span>
              </Button>
              <Button 
                variant="outline" 
                className={`flex flex-col items-center h-auto py-3 space-y-1 ${isNotGoing ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400' : ''}`}
                onClick={() => onRsvp(event.id, 'not_going')}
              >
                <XCircle className={`w-5 h-5 ${isNotGoing ? 'text-red-500' : 'text-slate-400'}`} />
                <span className="text-xs">Not Going ({notGoingCount})</span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
