import { create } from 'zustand';
import { 
  generateCountryId,
  generateCityId,
  generateTownId,
  generateDistrictId,
  generateStreetId,
  generateBuildingId,
  generateEntranceId,
  generateApartmentId,
  generateUserId
} from '../lib/idGenerator';

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
  
  // Property detailed fields and IDs
  country?: string;
  countryId?: string;
  city?: string;
  cityId?: string;
  town?: string;
  townId?: string;
  districtId?: string;
  street?: string;
  streetId?: string;
  building?: string;
  buildingId?: string;
  entrance?: string;
  entranceId?: string;
  apartment?: string;
  apartmentId?: string;
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
  
  // Detailed property fields and IDs
  country?: string;
  countryId?: string;
  city?: string;
  cityId?: string;
  town?: string;
  townId?: string;
  districtId?: string;
  street?: string;
  streetId?: string;
  building?: string;
  buildingId?: string;
  entrance?: string;
  entranceId?: string;
  apartment?: string;
  apartmentId?: string;
  registrationDate?: string;

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
  login: (
    email: string, 
    pass: string, 
    name: string,
    details?: {
      country?: string;
      city?: string;
      town?: string;
      district?: string;
      street?: string;
      building?: string;
      entrance?: string;
      apartment?: string;
      phone?: string;
    }
  ) => Promise<void>;
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
  login: async (email, pass, name, details) => {
    // Level 1 - Registered User (Identity Verified via Auth)
    const isMilestone = true;
    
    // Fallbacks to default values if registration details are empty
    const country = details?.country || 'Azerbaijan';
    const city = details?.city || 'Baku';
    const town = details?.town || 'Sabail';
    const district = details?.district || 'Sabail';
    const street = details?.street || 'Nizami St';
    const building = details?.building || '42';
    const entrance = details?.entrance || '2';
    const apartment = details?.apartment || '15';
    const phone = details?.phone || '+994501234567';
    const registrationDate = new Date();

    // Generate property IDs
    const countryId = generateCountryId(country);
    const cityId = generateCityId(city, countryId);
    const townId = generateTownId(town, cityId);
    const districtId = generateDistrictId(district, cityId);
    const streetId = generateStreetId(street, districtId);
    const buildingId = generateBuildingId(building, streetId);
    const entranceId = generateEntranceId(entrance, buildingId);
    const apartmentId = generateApartmentId(apartment, buildingId);

    // Generate user ID using custom rule
    const customUid = generateUserId({
      country,
      city,
      street,
      apartment,
      phone,
      registrationDate
    });

    const primaryLocationId = 'loc-' + Date.now();
    const primaryLocation: UserLocation = {
      id: primaryLocationId,
      type: 'HOME',
      name: 'Home Address',
      district,
      address: `${street}, Bldg ${building}, Apt ${apartment}`,
      verified: true, // Auto-verify primary home address for standard registration flow
      verification_method: 'sms',
      country,
      countryId,
      city,
      cityId,
      town,
      townId,
      districtId,
      street,
      streetId,
      building,
      buildingId,
      entrance,
      entranceId,
      apartment,
      apartmentId
    };

    set({
      user: {
        uid: customUid,
        email,
        phone,
        name: name || 'New Neighbor',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: email.endsWith('@qonsu.dev') ? 'moderator' : 'user',
        trust_level: 2, // With a verified home address, trust level is 2
        trust_scores: { identity: 40, location: 40, community: 10, overall: 90 },
        locations: [primaryLocation],
        activeLocationId: primaryLocationId,
        is_verified: true,
        isMilestoneUser: isMilestone,
        district,
        address: primaryLocation.address,
        country,
        countryId,
        city,
        cityId,
        town,
        townId,
        districtId,
        street,
        streetId,
        building,
        buildingId,
        entrance,
        entranceId,
        apartment,
        apartmentId,
        registrationDate: registrationDate.toISOString()
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
