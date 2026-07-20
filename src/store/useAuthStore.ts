import { create } from 'zustand';

export interface TrustScores {
  identity: number;
  location: number;
  community: number;
  overall: number;
}

export type TrustLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type LocationType = 'HOME' | 'WORK' | 'VACATION' | 'PARENTS' | 'OTHER';

export interface UserLocation {
  id: string;
  type: LocationType;
  name: string;
  district: string;
  address: string;
  verified: boolean;
  verification_method?: 'gps' | 'docs' | 'sms' | 'postcard' | 'neighbor';
}

export interface User {
  uid: string;
  phone?: string;
  name: string;
  email?: string;
  avatar?: string;
  
  trust_scores: TrustScores;
  trust_level: TrustLevel;
  locations: UserLocation[];
  activeLocationId: string | null;

  is_verified: boolean; // Derived or legacy, kept for compatibility
  role: 'guest' | 'user' | 'moderator' | 'admin' | 'business';
  
  // Legacy / extra fields
  district?: string;
  address?: string;
  isMilestoneUser?: boolean; 
  birthday?: string;
  allowBirthdayPublic?: boolean;
  cars?: { country: string; number: string }[];
  isAnonymous?: boolean;
  originalName?: string;
  originalAvatar?: string;
  nationality?: string;
  childrenCount?: number;
  childrenAges?: string;
  interests?: string[];
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
  login: (email: string, pass: string, name: string) => Promise<void>;
  createGuestSession: () => void;
  verifyLocation: (locationId: string, method: string) => void;
  switchLocation: (locationId: string) => void;
  logout: () => void;
}

const createGuestUser = (): User => ({
  uid: 'guest-' + Date.now(),
  name: 'Guest',
  role: 'guest',
  trust_level: 0,
  trust_scores: { identity: 0, location: 0, community: 0, overall: 0 },
  locations: [],
  activeLocationId: null,
  is_verified: false,
});

export const useAuthStore = create<AuthState>((set, get) => ({
  user: createGuestUser(), // Start as guest
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
  login: async (email, pass, name) => {
    // Level 1 - Registered User (Identity Verified via Auth)
    const isMilestone = true; 
    set({
      user: {
        uid: 'user-' + Date.now(),
        email,
        name: name || 'New Neighbor',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: email.endsWith('@qonsu.dev') ? 'moderator' : 'user',
        trust_level: 1,
        trust_scores: { identity: 20, location: 0, community: 0, overall: 20 },
        locations: [],
        activeLocationId: null,
        is_verified: false,
        isMilestoneUser: isMilestone,
      }
    });
  },
  createGuestSession: () => set({ user: createGuestUser() }),
  verifyLocation: (locationId, method) => set((state) => {
    if (!state.user) return state;
    
    const newLocations = state.user.locations.map(loc => {
      if (loc.id === locationId) {
        return { ...loc, verified: true, verification_method: method as any };
      }
      return loc;
    });

    const hasVerifiedLocation = newLocations.some(l => l.verified);
    
    // Level 2 - Verified Resident
    let newLevel = state.user.trust_level;
    let locationScore = state.user.trust_scores.location;
    if (hasVerifiedLocation) {
      newLevel = Math.max(newLevel, 2) as TrustLevel;
      locationScore = 40; // example increment
    }

    const newScores = {
      ...state.user.trust_scores,
      location: locationScore,
      overall: state.user.trust_scores.identity + locationScore + state.user.trust_scores.community
    };

    return {
      user: {
        ...state.user,
        locations: newLocations,
        trust_level: newLevel,
        trust_scores: newScores,
        is_verified: hasVerifiedLocation,
        // Update legacy fields for compatibility
        district: newLocations.find(l => l.id === locationId)?.district || state.user.district,
        address: newLocations.find(l => l.id === locationId)?.address || state.user.address,
      }
    };
  }),
  switchLocation: (locationId) => set((state) => {
    if (!state.user) return state;
    const loc = state.user.locations.find(l => l.id === locationId);
    if (!loc) return state;
    return {
      user: {
        ...state.user,
        activeLocationId: locationId,
        district: loc.district,
        address: loc.address,
      }
    };
  }),
  logout: () => set({ user: createGuestUser() }),
}));
