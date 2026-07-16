import { create } from 'zustand';

export interface User {
  uid: string;
  phone?: string;
  name: string;
  username?: string;
  fullname?: string;
  email?: string;
  bio?: string;
  interests?: string[];
  router_code?: string;
  avatar?: string;
  cars?: { country: string; number: string }[];
  birthday?: string;
  allowBirthdayPublic?: boolean;
  district: string;
  address?: string;
  childrenCount?: number;
  childrenAges?: string;
  nationality?: string;
  is_verified: boolean;
  role: 'user' | 'moderator' | 'admin' | 'business';
  trust_rating: number;
  isAnonymous?: boolean;
  originalName?: string;
  originalAvatar?: string;
  is_business_verified?: boolean;
  isMilestoneUser?: boolean; // Gold badge
  business_details?: {
    category: string;
    address: string;
    registration_number: string;
  };
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  login: (email: string, pass: string, name: string, district: string, address: string, avatar: string, verified: boolean) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
  login: async (email, pass, name, district = 'Nasimi', address = '', avatar = '', verified = false) => {
    // Mock milestone logic: for demo purposes, assume 10% chance to be a milestone user, 
    // or just set it based on some string condition so it's testable if needed.
    // Let's just set it to true so the user sees the feature.
    const isMilestone = true; 

    set({
      user: {
        uid: 'mock-uid-' + Date.now(),
        email,
        name: name || 'New Neighbor',
        district: district,
        address: address,
        avatar: avatar,
        is_verified: verified,
        isMilestoneUser: isMilestone,
        role: 'user',
        trust_rating: 50,
      }
    });
  },
  logout: () => set({ user: null }),
}));
