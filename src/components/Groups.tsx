import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Users, Hash, Plus, MessageCircle, Send, ArrowLeft, Search } from 'lucide-react';
import VerificationGate from './VerificationGate';
import { useAuthStore } from '../store/useAuthStore';

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  type: 'interest' | 'location';
  isMember: boolean;
}

const MOCK_GROUPS: Group[] = [
  { id: '1', name: 'Building 3 Landing 4', description: 'Neighbors from landing 4 in building 3.', members: 4, type: 'location', isMember: true },
  { id: '2', name: 'Courtyard Parents', description: 'Playdates and discussions for parents.', members: 12, type: 'interest', isMember: true },
  { id: '3', name: 'Football Fans', description: 'Weekend matches at the local park.', members: 8, type: 'interest', isMember: false },
  { id: '4', name: 'Renovation Tips', description: 'Share contractors and tips.', members: 25, type: 'interest', isMember: false },
];

export default function Groups() {
  const { user } = useAuthStore();
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, sender: string, time: Date}[]>([
    { text: 'Hello everyone!', sender: 'John', time: new Date(Date.now() - 3600000) },
    { text: 'Hi! Ready for the meeting tomorrow?', sender: 'Jane', time: new Date(Date.now() - 1800000) }
  ]);
  const [tab, setTab] = useState<'my_groups' | 'discover'>('my_groups');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setGroups([{ id: Date.now().toString(), name: newGroupName, description: newGroupDesc, members: 1, type: 'interest', isMember: true }, ...groups]);
    setShowCreateForm(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const myGroups = groups.filter(g => g.isMember);
  const discoverGroups = groups.filter(g => !g.isMember);

  const handleJoin = (id: string) => {
    setGroups(groups.map(g => g.id === id ? { ...g, isMember: true, members: g.members + 1 } : g));
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { text: newMessage, sender: user?.name || 'Me', time: new Date() }]);
    setNewMessage('');
  };

  if (activeGroup) {
    return (
      <div className="flex flex-col h-[calc(100vh-12rem)] md:h-[600px] w-full max-w-4xl mx-auto glass-panel overflow-hidden border-black/10 dark:border-white/10 rounded-2xl shadow-xl">
        <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center space-x-3 bg-white/40 dark:bg-black/20">
          <button onClick={() => setActiveGroup(null)} className="p-2 -ml-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
            {activeGroup.type === 'location' ? <Hash className="h-5 w-5 text-indigo-400" /> : <Users className="h-5 w-5 text-indigo-400" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{activeGroup.name}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">{activeGroup.members} members</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-transparent">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender === user?.name ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-black/10 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                {msg.sender !== user?.name && <p className="text-[10px] font-bold mb-1 opacity-70">{msg.sender}</p>}
                <p className="text-sm">{msg.text}</p>
                <span className="text-[10px] opacity-60 mt-1 block text-right">
                  {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20">
          <form onSubmit={handleSend} className="flex items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message group..."
              className="flex-1 bg-black/5 dark:bg-white/5 border-none rounded-full"
            />
            <Button type="submit" disabled={!newMessage.trim()} className="rounded-full w-10 h-10 p-0 bg-indigo-600 hover:bg-indigo-500 text-white flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Groups</h2>
        {!showCreateForm ? (
          <Button variant="outline" size="sm" onClick={() => setShowCreateForm(true)} className="border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10">
            <Plus className="h-4 w-4 mr-2" /> New Group
          </Button>
        ) : (
          <form onSubmit={handleCreateGroup} className="flex items-center gap-2">
            <Input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Group name" className="h-9 w-40" required />
            <Input value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Description" className="h-9 w-48" />
            <Button type="submit" size="sm">Create</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>Cancel</Button>
          </form>
        )}
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTab('my_groups')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${tab === 'my_groups' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          My Groups ({myGroups.length})
        </button>
        <button
          onClick={() => setTab('discover')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${tab === 'discover' ? 'border-indigo-500 text-indigo-500' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
        >
          Discover
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(tab === 'my_groups' ? myGroups : discoverGroups).map(group => (
          <Card key={group.id} className="glass-panel border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer" onClick={() => group.isMember && setActiveGroup(group)}>
            <CardContent className="p-4 flex items-start space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                {group.type === 'location' ? <Hash className="h-6 w-6 text-indigo-400" /> : <Users className="h-6 w-6 text-indigo-400" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">{group.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{group.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] font-medium text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">{group.members} members</span>
                  {!group.isMember && (
                    <Button size="sm" onClick={(e) => { e.stopPropagation(); handleJoin(group.id); }} className="h-7 text-xs bg-indigo-500 hover:bg-indigo-600 text-white">Join</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
