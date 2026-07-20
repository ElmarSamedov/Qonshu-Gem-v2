import { create } from 'zustand';

export interface Message {
  id: number;
  text: string;
  senderId: string;
  timestamp: Date;
  audioUrl?: string;
}

export interface ChatSession {
  id: string;
  name: string;
  type: 'neighbor' | 'business' | 'group';
  lastMessage: string;
  unread: number;
  messages: Message[];
}

interface ChatState {
  chats: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  openOrCreateChat: (id: string, name: string, type: ChatSession['type']) => void;
  sendMessage: (chatId: string, text: string, audioUrl?: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [
    {
      id: '1', name: 'Baku Roasters Cafe', type: 'business', unread: 1,
      lastMessage: 'Your coffee beans are ready for pickup!',
      messages: [
        { id: 1, text: 'Hi, do you have Ethiopian Yirgacheffe in stock?', senderId: 'me', timestamp: new Date(Date.now() - 3600000) },
        { id: 2, text: 'Yes, we just roasted a fresh batch yesterday. Shall I reserve a bag for you?', senderId: '1', timestamp: new Date(Date.now() - 3500000) },
      ]
    },
    {
      id: '2', name: 'Leyla (Neighbor)', type: 'neighbor', unread: 0,
      lastMessage: 'Sure, I can lend you the drill.',
      messages: [
        { id: 1, text: 'Hi Leyla, I saw your post about the power drill.', senderId: 'me', timestamp: new Date(Date.now() - 86400000) },
        { id: 2, text: 'Sure, I can lend you the drill.', senderId: '2', timestamp: new Date(Date.now() - 82800000) },
      ]
    }
  ],
  activeChatId: null,
  setActiveChatId: (id) => set({ activeChatId: id }),
  openOrCreateChat: (id, name, type) => {
    const exists = get().chats.some(c => c.id === id);
    if (!exists) {
      set(state => ({ 
        chats: [...state.chats, { id, name, type, lastMessage: '', unread: 0, messages: [] }] 
      }));
    }
    set({ activeChatId: id });
  },
  sendMessage: (chatId, text, audioUrl) => {
    set(state => ({
      chats: state.chats.map(c => c.id === chatId ? {
        ...c,
        lastMessage: audioUrl ? '🎤 Voice message' : text,
        messages: [...c.messages, { id: Date.now(), text, senderId: 'me', timestamp: new Date(), audioUrl }]
      } : c)
    }));
  }
}));
