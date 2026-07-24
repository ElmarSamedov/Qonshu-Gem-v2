import { useAuthStore } from './useAuthStore';
import { create } from 'zustand';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  setDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  where
} from 'firebase/firestore';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  audioUrl?: string;
  reactions?: string[];
}

export interface ChatSession {
  id: string;
  name: string;
  type: 'neighbor' | 'business' | 'group';
  lastMessage: string;
  unread: number;
  messages: Message[];
  participants?: string[];
}

interface ChatState {
  chats: ChatSession[];
  activeChatId: string | null;
  activeMessagesUnsubscribe: (() => void) | null;
  setActiveChatId: (id: string | null) => void;
  openOrCreateChat: (id: string, name: string, type: ChatSession['type']) => Promise<void>;
  sendMessage: (chatId: string, text: string, audioUrl?: string, senderId?: string) => Promise<void>;
  toggleReaction: (chatId: string, messageId: string, emoji: string) => Promise<void>;
  initListener: (userId: string) => () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,
  activeMessagesUnsubscribe: null,
  setActiveChatId: (id) => {
    set({ activeChatId: id });
    
    // Clear old messages subscription if any
    const oldUnsub = get().activeMessagesUnsubscribe;
    if (oldUnsub) {
      oldUnsub();
    }

    if (id) {
      const q = query(collection(db, 'chats', id, 'messages'), orderBy('timestamp', 'asc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const messagesList: Message[] = [];
        snapshot.forEach((doc) => {
          messagesList.push({
            id: doc.id,
            ...doc.data()
          } as Message);
        });

        // Merge messages into the active chat session in state
        set(state => ({
          chats: state.chats.map(c => c.id === id ? { ...c, messages: messagesList } : c)
        }));
      });
      set({ activeMessagesUnsubscribe: unsub as any });
    }
  },
  openOrCreateChat: async (id, name, type) => {
    const exists = get().chats.some(c => c.id === id);
    if (!exists) {
      // Extract uids from the deterministic chatId, e.g. "uid1_uid2"
      const parts = id.split('_');
      // Some targets might have dashes, but the user UIDs generally don't contain underscores.
      // Actually, since we generate the ID, we can safely just add the current user's UID to participants.
      // Wait, what if the other participant's UID is not easily extracted?
      // Since it's deterministic [user.uid, target.uid].sort().join('_'), parts will be [uid1, targetId].
      const participants = parts.length >= 2 ? parts : [id];
      const newChat: Omit<ChatSession, 'messages'> = {
        id,
        name,
        type,
        lastMessage: '',
        unread: 0,
        participants
      };
      try {
        await setDoc(doc(db, 'chats', id), newChat);
      } catch (e) {
        console.error('Failed to create chat session:', e);
      }
    }
    get().setActiveChatId(id);
  },
  sendMessage: async (chatId, text, audioUrl, senderId) => {
    const resolvedSenderId = senderId || useAuthStore.getState().user?.uid || 'guest';
    const messageData = {
      text,
      senderId: resolvedSenderId,
      timestamp: new Date().toISOString(),
      audioUrl: audioUrl || '',
      reactions: []
    };
    
    try {
      // 1. Add message document to subcollection
      const messageDocRef = doc(collection(db, 'chats', chatId, 'messages'));
      await setDoc(messageDocRef, messageData);

      // 2. Update chat session lastMessage
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: audioUrl ? '🎤 Voice message' : text
      });
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  },
  toggleReaction: async (chatId, messageId, emoji) => {
    const chat = get().chats.find(c => c.id === chatId);
    if (!chat) return;
    const message = chat.messages.find(m => m.id === messageId);
    if (!message) return;

    const hasEmoji = message.reactions?.includes(emoji);
    const updatedReactions = hasEmoji
      ? (message.reactions || []).filter(r => r !== emoji)
      : [...(message.reactions || []), emoji];

    try {
      await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
        reactions: updatedReactions
      });
    } catch (e) {
      console.error('Failed to toggle message reaction:', e);
    }
  },
  initListener: (userId: string) => {
    const unsubscribeChats = onSnapshot(query(collection(db, 'chats'), where('participants', 'array-contains', userId)), (snapshot) => {
      const chatsList: ChatSession[] = [];
      snapshot.forEach((chatDoc) => {
        const chatData = chatDoc.data() as Omit<ChatSession, 'messages'>;
        chatsList.push({
          ...chatData,
          messages: get().chats.find(c => c.id === chatDoc.id)?.messages || []
        });
      });
      set({ chats: chatsList });
    }, (error) => {
      console.error('Failed to fetch chats from Firestore:', error);
    });

    return () => {
      unsubscribeChats();
      const activeUnsub = get().activeMessagesUnsubscribe;
      if (activeUnsub) {
        activeUnsub();
      }
    };
  }
}));
