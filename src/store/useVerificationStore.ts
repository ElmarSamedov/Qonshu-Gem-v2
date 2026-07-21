import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export interface VerificationRequest {
  id: number;
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
  addRequest: (request: Omit<VerificationRequest, 'id' | 'status' | 'date'>) => void;
  approveRequest: (id: number) => void;
  rejectRequest: (id: number) => void;
}

export const useVerificationStore = create<VerificationStore>((set, get) => ({
  requests: [
    {
      id: 1,
      userId: 'user-ali',
      name: 'Ali M.',
      district: 'Nasimi',
      documentUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
      status: 'pending',
      date: '2026-07-18',
      locationId: 'loc-ali'
    },
    {
      id: 2,
      userId: 'user-zahra',
      name: 'Zahra K.',
      district: 'Nasimi',
      documentUrl: 'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=400&h=300&fit=crop',
      status: 'pending',
      date: '2026-07-19',
      locationId: 'loc-zahra'
    }
  ],
  addRequest: (req) => set((state) => ({
    requests: [
      ...state.requests,
      {
        ...req,
        id: Date.now() + Math.floor(Math.random() * 1000),
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      }
    ]
  })),
  approveRequest: (id) => {
    const request = get().requests.find(r => r.id === id);
    if (request) {
      const auth = useAuthStore.getState();
      // If the request belongs to the currently logged-in user, verify their location
      if (auth.user && auth.user.uid === request.userId) {
        auth.verifyLocation(request.locationId, 'docs');
      }
    }
    set((state) => ({
      requests: state.requests.map(r => r.id === id ? { ...r, status: 'approved' } : r)
    }));
  },
  rejectRequest: (id) => set((state) => ({
    requests: state.requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r)
  }))
}));
