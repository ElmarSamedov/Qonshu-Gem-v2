import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { db } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';

export interface VerificationRequest {
  id: string;
  userId: string;
  name: string;
  district: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  locationId: string;
}

interface VerificationStore {
  requests: VerificationRequest[];
  addRequest: (request: Omit<VerificationRequest, 'id' | 'status' | 'date'>) => Promise<void>;
  approveRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
  initListener: () => () => void;
}

export const useVerificationStore = create<VerificationStore>((set, get) => ({
  requests: [],
  addRequest: async (req) => {
    const newId = 'req-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newRequest: VerificationRequest = {
      ...req,
      id: newId,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    try {
      await setDoc(doc(db, 'verification_requests', newId), newRequest);
    } catch (e) {
      console.error('Failed to save verification request:', e);
    }
  },
  approveRequest: async (id) => {
    const request = get().requests.find(r => r.id === id);
    if (request) {
      const auth = useAuthStore.getState();
      if (auth.user && auth.user.uid === request.userId) {
        await auth.verifyLocation(request.locationId, 'docs');
      }
      try {
        await updateDoc(doc(db, 'verification_requests', id), { status: 'approved' });
      } catch (e) {
        console.error('Failed to approve verification request:', e);
      }
    }
  },
  rejectRequest: async (id) => {
    try {
      await updateDoc(doc(db, 'verification_requests', id), { status: 'rejected' });
    } catch (e) {
      console.error('Failed to reject verification request:', e);
    }
  },
  initListener: () => {
    const unsubscribe = onSnapshot(collection(db, 'verification_requests'), (snapshot) => {
      const requestsList: VerificationRequest[] = [];
      snapshot.forEach((doc) => {
        requestsList.push(doc.data() as VerificationRequest);
      });
      set({ requests: requestsList });
    }, (error) => {
      console.error('Failed to fetch verification requests from Firestore:', error);
    });
    return unsubscribe;
  }
}));
