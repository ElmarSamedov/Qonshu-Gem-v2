import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BarChart2, Plus, X, Check, BadgeCheck, Eye } from 'lucide-react';
import VerificationGate from './VerificationGate';
import { useLanguageStore } from '../store/useLanguageStore';
import { t } from '../lib/i18n';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface Poll {
  id: number;
  question: string;
  author: string;
  verified?: boolean;
  time: string;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
}

export default function Polls() {
  const [showForm, setShowForm] = useState(false);
  const { language } = useLanguageStore();
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState(['', '']);
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: 1,
      question: 'Should we hire a new cleaning company for the building?',
      author: 'Building Management',
      verified: true,
      time: '2 hours ago',
      totalVotes: 45,
      hasVoted: false,
      options: [
        { id: 1, text: 'Yes, the current one is bad', votes: 30 },
        { id: 2, text: 'No, let\'s keep the current one', votes: 10 },
        { id: 3, text: 'I don\'t care', votes: 5 },
      ]
    },
    {
      id: 2,
      question: 'Best time for the neighborhood weekend cleanup?',
      author: 'Leyla M.',
      verified: false,
      time: '1 day ago',
      totalVotes: 12,
      hasVoted: true,
      options: [
        { id: 1, text: 'Saturday morning (9 AM)', votes: 8 },
        { id: 2, text: 'Saturday afternoon (3 PM)', votes: 1 },
        { id: 3, text: 'Sunday morning (10 AM)', votes: 3 },
      ]
    }
  ]);

  const handleAddOption = () => {
    setNewPollOptions([...newPollOptions, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (newPollOptions.length <= 2) return;
    const newOptions = [...newPollOptions];
    newOptions.splice(index, 1);
    setNewPollOptions(newOptions);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newPollOptions];
    newOptions[index] = value;
    setNewPollOptions(newOptions);
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion || newPollOptions.some(opt => !opt.trim())) return;

    const newPoll: Poll = {
      id: Date.now(),
      question: newPollQuestion,
      author: 'Current User',
      time: 'Just now',
      totalVotes: 0,
      hasVoted: false,
      options: newPollOptions.map((opt, i) => ({ id: i, text: opt, votes: 0 }))
    };

    setPolls([newPoll, ...polls]);
    setShowForm(false);
    setNewPollQuestion('');
    setNewPollOptions(['', '']);
  };

  const handleVote = (pollId: number, optionId: number) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId && !poll.hasVoted) {
        return {
          ...poll,
          hasVoted: true,
          totalVotes: poll.totalVotes + 1,
          options: poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      }
      return poll;
    }));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('polls.title', language)}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{t('polls.subtitle', language)}</p>
        </div>
      </div>

      <VerificationGate>
        {!showForm ? (
          <Card className="glass-panel border-dashed border-2 border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 shadow-2xl">
            <CardContent className="p-6 text-center">
              <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">{t('polls.want_ask', language)}</h3>
              <Button onClick={() => setShowForm(true)} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-none shadow-lg shadow-blue-500/20">
                <Plus className="mr-2 h-4 w-4" /> {t('polls.create', language)}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel border-black/20 dark:border-white/20 bg-white/60 dark:bg-black/40 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg text-slate-900 dark:text-white">{t('polls.new_poll', language)}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePoll} className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <Eye className="w-4 h-4" />
                  <span>Visible to:</span>
                  <select className="bg-transparent border-b border-black/20 dark:border-white/20 text-slate-900 dark:text-white outline-none focus:border-indigo-500">
                    <option value="everyone" className="text-black">Everyone</option>
                    <option value="building" className="text-black">Same Building</option>
                    <option value="landing" className="text-black">Same Landing</option>
                    <option value="courtyard" className="text-black">Same Courtyard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('polls.question', language)}</label>
                  <Input 
                    value={newPollQuestion}
                    onChange={(e) => setNewPollQuestion(e.target.value)}
                    placeholder="E.g., Should we host a block party next month?"
                    className="bg-white/40 dark:bg-black/20 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('polls.options', language)}</label>
                  {newPollOptions.map((opt, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Input
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        placeholder={`${t('polls.option', language)} ${i + 1}`}
                        className="bg-white/40 dark:bg-black/20 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500"
                        required
                      />
                      {newPollOptions.length > 2 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveOption(i)} 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {newPollOptions.length < 5 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddOption}
                      className="text-indigo-400 border-indigo-400/30 bg-transparent hover:bg-indigo-500/20 mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> {t('polls.add_option', language)}
                    </Button>
                  )}
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white mt-4">
                  {t('polls.publish', language)}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </VerificationGate>

      <div className="space-y-4">
        {polls.map(poll => (
          <Card key={poll.id} className="glass-panel border-black/10 dark:border-white/10 overflow-hidden shadow-xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-slate-900 dark:text-white mb-1">{poll.question}</CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 flex items-center text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300 mr-1">{poll.author}</span>
                    {poll.verified && <BadgeCheck className="h-3 w-3 text-blue-500 mr-2" />}
                    {!poll.verified && <span className="mr-1"></span>}
                    <span className={poll.verified ? "" : "ml-1"}>• {poll.time}</span>
                  </p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {poll.options.map(opt => {
                const percentage = poll.totalVotes === 0 ? 0 : Math.round((opt.votes / poll.totalVotes) * 100);
                
                return (
                  <div key={opt.id} className="relative">
                    {!poll.hasVoted ? (
                      <Button 
                        variant="outline" 
                        onClick={() => handleVote(poll.id, opt.id)}
                        className="w-full justify-start h-12 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-300 transition-all"
                      >
                        {opt.text}
                      </Button>
                    ) : (
                      <div className="relative w-full h-12 bg-white/60 dark:bg-black/40 rounded-lg overflow-hidden flex items-center px-4 border border-white/5">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-blue-500/20 transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="relative z-10 flex justify-between w-full items-center">
                          <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">{opt.text}</span>
                          <span className="text-sm text-slate-900 dark:text-white font-bold">{percentage}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                <span>{poll.totalVotes} {t('polls.votes', language)}</span>
                {poll.hasVoted && <span className="text-blue-400 flex items-center"><Check className="h-3 w-3 mr-1" /> {t('polls.you_voted', language)}</span>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
