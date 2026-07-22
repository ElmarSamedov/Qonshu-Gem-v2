import { create } from 'zustand';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

import { isValidTransition } from '../lib/statusTransitions';

export interface Report {
  id: string;
  type: 'post' | 'listing';
  contentId: string;
  content: string;
  author: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
  aiScores?: {
    nsfw: number;
    arLaw: number;
  };
}

interface ModerationState {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'status' | 'aiScores'>) => Promise<void>;
  updateReportStatus: (id: string, status: Report['status']) => Promise<void>;
  initListener: () => () => void;
}

export const useModerationStore = create<ModerationState>((set) => ({
  reports: [],
  addReport: async (report) => {
    const id = Math.random().toString(36).substring(7);
    
    const newReport: Report = {
      ...report,
      id,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    try {
      await setDoc(doc(db, 'reports', id), newReport);
    } catch (e) {
      console.error('Failed to add moderation report:', e);
    }
  },
  updateReportStatus: async (id, status) => {
    const currentState = useModerationStore.getState().reports.find(r => r.id === id)?.status || 'pending';
    if (!isValidTransition(currentState, status)) {
      console.warn(`Invalid state transition from ${currentState} to ${status}`);
      return;
    }
    
    try {
      await updateDoc(doc(db, 'reports', id), { status });
    } catch (e) {
      console.error('Failed to update report status:', e);
    }
  },
  initListener: () => {
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const reportsList: Report[] = [];
      snapshot.forEach((doc) => {
        reportsList.push(doc.data() as Report);
      });
      set({ reports: reportsList });
    }, (error) => {
      console.error('Failed to fetch reports from Firestore:', error);
    });
    return unsubscribe;
  }
}));
