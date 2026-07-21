import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Store, User, ArrowLeft, Smile, Reply, Users, Plus, Mic, Square, Trash2 } from 'lucide-react';
import VerificationGate from './VerificationGate';
import { useChatStore, Message, ChatSession } from '../store/useChatStore';

export default function Chat() {
  const { chats, activeChatId, setActiveChatId, sendMessage, toggleReaction } = useChatStore();
  const activeChat = chats.find(c => c.id === activeChatId) || null;
  const [newMessage, setNewMessage] = useState('');
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleSendMessage = (e?: React.FormEvent, audioUrl?: string) => {
    if (e) e.preventDefault();
    if ((!newMessage.trim() && !audioUrl) || !activeChat) return;

    sendMessage(activeChat.id, newMessage, audioUrl);
    setNewMessage('');
  };


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleSendMessage(undefined, audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.onstop = () => {
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] md:h-[600px] w-full max-w-4xl mx-auto glass-panel overflow-hidden border-black/10 dark:border-white/10 rounded-2xl shadow-xl">
      {/* Sidebar */}
      <div className={`w-full sm:w-1/3 border-r border-black/10 dark:border-white/10 flex flex-col bg-white/40 dark:bg-black/20 ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-black/10 dark:border-white/10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
              }}
              className={`w-full p-4 text-left border-b border-black/5 dark:border-white/5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${activeChat?.id === chat.id ? 'bg-black/5 dark:bg-white/5' : ''}`}
            >
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  {chat.type === 'business' ? <Store className="h-5 w-5 text-indigo-400" /> : <User className="h-5 w-5 text-indigo-400" />}
                </div>
                <div className="flex-1 min-w-0 flex justify-between items-start">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate pr-2">{chat.name}</h3>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate pl-13">{chat.lastMessage}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`w-full sm:w-2/3 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center space-x-3">
              <button 
                onClick={() => setActiveChatId(null)}
                className="sm:hidden p-2 -ml-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                {activeChat.type === 'business' ? <Store className="h-5 w-5 text-indigo-400" /> : <User className="h-5 w-5 text-indigo-400" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{activeChat.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{activeChat.type === 'business' ? 'Verified Business' : 'Neighbor'}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {activeChat.messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`group relative max-w-[75%] p-3 rounded-2xl ${msg.senderId === 'me' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-black/10 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    {msg.audioUrl && (
                      <audio controls className="max-w-[200px] h-10 mt-1 mb-1">
                        <source src={msg.audioUrl} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                     <span className="text-[10px] opacity-60 mt-1 block text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 justify-end">
                        {msg.reactions.map((emoji, eIdx) => (
                          <span key={eIdx} className="bg-black/20 dark:bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full select-none">{emoji}</span>
                        ))}
                      </div>
                    )}
                    
                    {/* Reaction & Reply buttons on hover */}
                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${msg.senderId === 'me' ? 'right-full mr-2' : 'left-full ml-2'}`}>
                      <button 
                        onClick={() => toggleReaction(activeChat.id, msg.id, '👍')}
                        className="w-6 h-6 rounded-full bg-white dark:bg-slate-700 shadow flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        <Smile className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => setNewMessage(`Replying to "${msg.text ? msg.text.substring(0, 15) : 'voice message'}...": `)}
                        className="w-6 h-6 rounded-full bg-white dark:bg-slate-700 shadow flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-black/10 dark:border-white/10 bg-white/40 dark:bg-black/20">
              <VerificationGate>
                {isRecording ? (
                  <div className="flex items-center justify-between space-x-2 bg-red-500/10 dark:bg-red-500/20 rounded-full px-4 py-2 border border-red-500/20">
                    <div className="flex items-center space-x-3 text-red-500 font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                      <span>{formatTime(recordingTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button onClick={cancelRecording} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button onClick={stopRecording} size="sm" className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-500 text-white rounded-full">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-slate-500 focus-visible:ring-blue-500 rounded-full"
                    />
                    {newMessage.trim() ? (
                      <Button type="submit" className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-500 text-white flex-shrink-0 flex items-center justify-center">
                        <Send className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="button" onClick={startRecording} className="rounded-full w-10 h-10 p-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 flex-shrink-0 flex items-center justify-center">
                        <Mic className="h-4 w-4" />
                      </Button>
                    )}
                  </form>
                )}
              </VerificationGate>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <Send className="h-8 w-8 opacity-50" />
            </div>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
