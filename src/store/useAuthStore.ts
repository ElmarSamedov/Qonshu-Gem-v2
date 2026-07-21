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
  addLocation: (location: Omit<UserLocation, 'id' | 'verified'> & { id?: string; verified?: boolean }) => void;
  removeLocation: (locationId: string) => void;
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

    const primaryLocationId = 'loc-home';
    const primaryLocation: UserLocation = {
      id: primaryLocationId,
      type: 'HOME',
      name: 'Home Address',
      district,
      address: `${street}, Bldg ${building}, Apt ${apartment}`,
      verified: false, // Set to false initially so they must verify it via the VerificationGate
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
        trust_level: 1, // Start as trust level 1 (registered) until location is verified
        trust_scores: { identity: 40, location: 0, community: 10, overall: 50 },
        locations: [primaryLocation],
        activeLocationId: primaryLocationId,
        is_verified: false,
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
    
    // Fallback: if locationId doesn't exist but we have locations, verify the first one or active one
    let targetLocId = locationId;
    if (!state.user.locations.some(loc => loc.id === locationId) && state.user.locations.length > 0) {
      targetLocId = state.user.activeLocationId || state.user.locations[0].id;
    }

    const newLocations = state.user.locations.map(loc => {
      if (loc.id === targetLocId) {
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
      locationScore = 40; // increment location score
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
        district: newLocations.find(l => l.id === targetLocId)?.district || state.user.district,
        address: newLocations.find(l => l.id === targetLocId)?.address || state.user.address,
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
  addLocation: (loc) => set((state) => {
    if (!state.user) return state;
    const newId = loc.id || 'loc-' + Date.now();
    const newLoc: UserLocation = {
      ...loc,
      id: newId,
      verified: loc.verified || false,
    };
    const locations = [...state.user.locations, newLoc];
    const activeLocationId = state.user.activeLocationId || newId;
    return {
      user: {
        ...state.user,
        locations,
        activeLocationId,
        district: activeLocationId === newId ? loc.district : state.user.district,
        address: activeLocationId === newId ? loc.address : state.user.address,
      }
    };
  }),
  removeLocation: (locationId) => set((state) => {
    if (!state.user) return state;
    const locations = state.user.locations.filter(l => l.id !== locationId);
    let activeLocationId = state.user.activeLocationId;
    if (activeLocationId === locationId) {
      activeLocationId = locations.length > 0 ? locations[0].id : null;
    }
    const activeLoc = locations.find(l => l.id === activeLocationId);
    return {
      user: {
        ...state.user,
        locations,
        activeLocationId,
        district: activeLoc ? activeLoc.district : '',
        address: activeLoc ? activeLoc.address : '',
      }
    };
  }),
  logout: () => set({ user: createGuestUser() }),
}));
