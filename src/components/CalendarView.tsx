import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Gift, Hammer, PartyPopper, Users, Plus, X } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from './ui/input';

interface Event {
  id: string;
  date: Date;
  title: string;
  type: 'birthday' | 'renovation' | 'holiday' | 'community';
  author?: string;
}

const INITIAL_EVENTS: Event[] = [
  { id: '1', date: new Date(2026, 6, 15), title: 'Novruz Holiday', type: 'holiday' },
  { id: '2', date: new Date(2026, 6, 20), title: 'Apt 4B Renovation', type: 'renovation', author: 'Elmar' },
  { id: '3', date: new Date(2026, 6, 25), title: 'Courtyard Meeting', type: 'community' }
];

export default function CalendarView() {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventType, setNewEventType] = useState<Event['type']>('community');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate) return;
    // We convert newEventDate to Date. Note: new Date(newEventDate) parses yyyy-mm-dd correctly.
    // However, sometimes it is parsed as UTC midnight, which might be off by a day in local timezone depending on implementation.
    // To be safe, we parse it with hyphens replaced or let standard Date construct it and set hours to noon to avoid off-by-one errors in local views.
    const dateObj = new Date(newEventDate + 'T12:00:00');
    setEvents([...events, { id: Date.now().toString(), date: dateObj, title: newEventTitle, type: newEventType, author: user?.name }]);
    setShowEventForm(false);
    setNewEventTitle('');
    setNewEventDate('');
  };

  // If user has a public birthday, we can dynamically add it
  React.useEffect(() => {
    if (user?.birthday && user.allowBirthdayPublic) {
      const bday = new Date(user.birthday);
      const thisYearBday = new Date(new Date().getFullYear(), bday.getMonth(), bday.getDate());
      setEvents(prev => {
        if (!prev.find(e => e.type === 'birthday' && e.author === user.name)) {
          return [...prev, { id: 'bday-' + user.uid, date: thisYearBday, title: `${user.name}'s Birthday`, type: 'birthday', author: user.name }];
        }
        return prev;
      });
    }
  }, [user]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = monthStart;
  const endDate = monthEnd;
  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const EventLabel: React.FC<{ event: Event }> = ({ event }) => {
    switch (event.type) {
      case 'birthday':
        return <div className="flex items-center space-x-1 text-[10px] bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded border border-pink-500/30 w-full truncate"><Gift className="w-3 h-3 flex-shrink-0"/> <span className="truncate">{event.title}</span></div>;
      case 'renovation':
        return <div className="flex items-center space-x-1 text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded border border-orange-500/30 w-full truncate"><Hammer className="w-3 h-3 flex-shrink-0"/> <span className="truncate">{event.title}</span></div>;
      case 'holiday':
        return <div className="flex items-center space-x-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30 w-full truncate"><PartyPopper className="w-3 h-3 flex-shrink-0"/> <span className="truncate">{event.title}</span></div>;
      case 'community':
        return <div className="flex items-center space-x-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 w-full truncate"><Users className="w-3 h-3 flex-shrink-0"/> <span className="truncate">{event.title}</span></div>;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Calendar & Events</h2>
      </div>

      <Card className="glass-panel border-black/10 dark:border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-indigo-400" />
            <CardTitle className="text-lg text-slate-900 dark:text-white">{format(currentDate, dateFormat)}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowEventForm(!showEventForm)} className="border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10 h-8">
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        {showEventForm && (
          <form onSubmit={handleAddEvent} className="p-4 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-3 animate-in fade-in duration-200">
            <div className="text-sm font-semibold text-slate-900 dark:text-white flex justify-between items-center">
              <span>Add New Event</span>
              <button type="button" onClick={() => setShowEventForm(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
                <Input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} required className="h-9" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Title</label>
                <Input type="text" placeholder="Event Title" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} required className="h-9" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Type</label>
                <select
                  value={newEventType}
                  onChange={e => setNewEventType(e.target.value as Event['type'])}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:border-slate-800"
                >
                  <option value="community">Community</option>
                  <option value="holiday">Holiday</option>
                  <option value="renovation">Renovation</option>
                  <option value="birthday">Birthday</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowEventForm(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Save Event</Button>
            </div>
          </form>
        )}
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-1">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {/* Pad the beginning of the month */}
            {Array.from({ length: startDate.getDay() }).map((_, i) => (
              <div key={`pad-${i}`} className="h-24 rounded-lg bg-black/5 dark:bg-white/5 opacity-50" />
            ))}
            
            {days.map(day => {
              const dayEvents = getDayEvents(day);
              return (
                <div 
                  key={day.toString()} 
                  className={`h-24 p-1 rounded-lg border flex flex-col space-y-1 overflow-hidden transition-colors ${
                    isToday(day) 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                  }`}
                >
                  <span className={`text-xs font-semibold ${isToday(day) ? 'text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {format(day, 'd')}
                  </span>
                  <div className="flex flex-col space-y-1 overflow-y-auto no-scrollbar pb-1">
                    {dayEvents.map(event => (
                      <EventLabel key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-3 rounded-xl flex items-center space-x-2 border border-black/10 dark:border-white/10">
          <PartyPopper className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Holidays</span>
        </div>
        <div className="glass-panel p-3 rounded-xl flex items-center space-x-2 border border-black/10 dark:border-white/10">
          <Gift className="h-5 w-5 text-pink-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Birthdays</span>
        </div>
        <div className="glass-panel p-3 rounded-xl flex items-center space-x-2 border border-black/10 dark:border-white/10">
          <Hammer className="h-5 w-5 text-orange-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Renovations</span>
        </div>
        <div className="glass-panel p-3 rounded-xl flex items-center space-x-2 border border-black/10 dark:border-white/10">
          <Users className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">Community</span>
        </div>
      </div>
    </div>
  );
}
