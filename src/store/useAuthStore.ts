import { create } from 'zustand';
import { calculateNewTrustScores } from '../lib/trustScores';
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
import { auth, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';

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
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  business_details?: {
    category: string;
    address: string;
    registration_number: string;
  };
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
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
  verifyLocation: (locationId: string, method: string) => Promise<void>;
  switchLocation: (locationId: string) => Promise<void>;
  addLocation: (location: Omit<UserLocation, 'id' | 'verified'> & { id?: string; verified?: boolean }) => Promise<void>;
  removeLocation: (locationId: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuthListener: () => void;
  loginWithGoogle: () => Promise<void>;
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
  updateUser: async (updates) => {
    const { user } = get();
    if (!user || user.role === 'guest') {
      set({ user: user ? { ...user, ...updates } : null });
      return;
    }
    const updatedUser = { ...user, ...updates };
    set({ user: updatedUser });
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
    } catch (e) {
      console.error('Failed to sync user updates to Firestore:', e);
    }
  },
  login: async (email, pass, name, details) => {
    let firebaseUser;
    try {
      // 1. Try to sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      firebaseUser = userCredential.user;
    } catch (signinError: any) {
      // 2. If user not found, try to register them
      if (signinError.code === 'auth/user-not-found' || signinError.code === 'auth/invalid-credential' || signinError.code === 'auth/wrong-password') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
          firebaseUser = userCredential.user;
        } catch (signupError: any) {
          throw new Error(signupError.message || 'Authentication failed');
        }
      } else {
        throw new Error(signinError.message || 'Authentication failed');
      }
    }

    if (!firebaseUser) {
      throw new Error('Authentication failed');
    }

    const uid = firebaseUser.uid;

    // Check if user already exists in Firestore
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const existingUser = userDocSnap.data() as User;
      set({ user: existingUser });
    } else {
      // Create new user in Firestore and state
      const isMilestone = true;
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

      const countryId = generateCountryId(country);
      const cityId = generateCityId(city, countryId);
      const townId = generateTownId(town, cityId);
      const districtId = generateDistrictId(district, cityId);
      const streetId = generateStreetId(street, districtId);
      const buildingId = generateBuildingId(building, streetId);
      const entranceId = generateEntranceId(entrance, buildingId);
      const apartmentId = generateApartmentId(apartment, buildingId);

      const primaryLocationId = 'loc-home';
      const primaryLocation: UserLocation = {
        id: primaryLocationId,
        type: 'HOME',
        name: 'Home Address',
        district,
        address: `${street}, Bldg ${building}, Apt ${apartment}`,
        verified: false,
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

      // Bootstrap elmar.myspace@gmail.com as moderator for verification/moderation testing
      const resolvedRole = (email.toLowerCase() === 'elmar.myspace@gmail.com') ? 'moderator' : 'user';

      const newUser: User = {
        uid,
        email,
        phone,
        name: name || 'New Neighbor',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        role: resolvedRole,
        trust_level: 1,
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
      };

      await setDoc(userDocRef, newUser);
      set({ user: newUser });
    }
  },
  createGuestSession: () => set({ user: createGuestUser() }),
  verifyLocation: async (locationId, method) => {
    const { user } = get();
    if (!user || user.role === 'guest') return;
    
    let targetLocId = locationId;
    if (!user.locations.some(loc => loc.id === locationId) && user.locations.length > 0) {
      targetLocId = user.activeLocationId || user.locations[0].id;
    }

    const newLocations = user.locations.map(loc => {
      if (loc.id === targetLocId) {
        return { ...loc, verified: true, verification_method: method as any };
      }
      return loc;
    });

    const hasVerifiedLocation = newLocations.some(l => l.verified);
    
    let { trust_level: newLevel, trust_scores: newScores } = calculateNewTrustScores(
      user.trust_level,
      user.trust_scores,
      hasVerifiedLocation
    );

    const targetLoc = newLocations.find(l => l.id === targetLocId);
    const updatedUser: User = {
      ...user,
      locations: newLocations,
      trust_level: newLevel,
      trust_scores: newScores,
      is_verified: hasVerifiedLocation,
      district: targetLoc?.district || user.district,
      address: targetLoc?.address || user.address,
    };

    set({ user: updatedUser });
    try {
      await setDoc(doc(db, 'users', user.uid), updatedUser);
    } catch (e) {
      console.error('Failed to sync verified location to Firestore:', e);
    }
  },
  switchLocation: async (locationId) => {
    const { user } = get();
    if (!user || user.role === 'guest') return;
    const loc = user.locations.find(l => l.id === locationId);
    if (!loc) return;

    const updatedUser: User = {
      ...user,
      activeLocationId: locationId,
      district: loc.district,
      address: loc.address,
    };

    set({ user: updatedUser });
    try {
      await setDoc(doc(db, 'users', user.uid), updatedUser);
    } catch (e) {
      console.error('Failed to sync switch location to Firestore:', e);
    }
  },
  addLocation: async (loc) => {
    const { user } = get();
    if (!user || user.role === 'guest') return;
    const newId = loc.id || 'loc-' + Date.now();
    const newLoc: UserLocation = {
      ...loc,
      id: newId,
      verified: loc.verified || false,
    };
    const locations = [...user.locations, newLoc];
    const activeLocationId = user.activeLocationId || newId;

    const updatedUser: User = {
      ...user,
      locations,
      activeLocationId,
      district: activeLocationId === newId ? loc.district : user.district,
      address: activeLocationId === newId ? loc.address : user.address,
    };

    set({ user: updatedUser });
    try {
      await setDoc(doc(db, 'users', user.uid), updatedUser);
    } catch (e) {
      console.error('Failed to sync added location to Firestore:', e);
    }
  },
  removeLocation: async (locationId) => {
    const { user } = get();
    if (!user || user.role === 'guest') return;
    const locations = user.locations.filter(l => l.id !== locationId);
    let activeLocationId = user.activeLocationId;
    if (activeLocationId === locationId) {
      activeLocationId = locations.length > 0 ? locations[0].id : null;
    }
    const activeLoc = locations.find(l => l.id === activeLocationId);

    const updatedUser: User = {
      ...user,
      locations,
      activeLocationId,
      district: activeLoc ? activeLoc.district : '',
      address: activeLoc ? activeLoc.address : '',
    };

    set({ user: updatedUser });
    try {
      await setDoc(doc(db, 'users', user.uid), updatedUser);
    } catch (e) {
      console.error('Failed to sync removed location to Firestore:', e);
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
    }
    set({ user: createGuestUser() });
  },
  initAuthListener: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          set({ user: userDocSnap.data() as User });
        } else {
          set({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Neighbor',
              role: 'user',
              trust_level: 1,
              trust_scores: { identity: 40, location: 0, community: 10, overall: 50 },
              locations: [],
              activeLocationId: null,
              is_verified: false
            }
          });
        }
      } else {
        set({ user: createGuestUser() });
      }
    });
  },
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const existingUser = userDocSnap.data() as User;
        set({ user: existingUser });
      } else {
        // Create new user in Firestore and state
        const primaryLocationId = 'loc-home';
        const primaryLocation: UserLocation = {
          id: primaryLocationId,
          type: 'HOME',
          name: 'Home Address',
          district: 'Unknown',
          address: 'Unknown Address',
          verified: false,
          country: 'Azerbaijan',
          countryId: 'aze',
          city: 'Baku',
          cityId: 'bak',
          town: 'Unknown',
          townId: 'unk',
          districtId: 'unk',
          street: 'Unknown',
          streetId: 'unk',
          building: '0',
          buildingId: '0',
          entrance: '0',
          entranceId: '0',
          apartment: '0',
          apartmentId: '0'
        };

        const resolvedRole = (firebaseUser.email?.toLowerCase() === 'elmar.myspace@gmail.com') ? 'moderator' : 'user';

        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          name: firebaseUser.displayName || 'Neighbor',
          role: resolvedRole,
          trust_level: 1,
          trust_scores: { identity: 40, location: 0, community: 10, overall: 50 },
          locations: [primaryLocation],
          activeLocationId: primaryLocationId,
          is_verified: false,
          district: 'Unknown',
          address: 'Unknown Address',
          country: 'Azerbaijan',
          countryId: 'aze',
          city: 'Baku',
          cityId: 'bak',
          town: 'Unknown',
          townId: 'unk',
          districtId: 'unk',
          street: 'Unknown',
          streetId: 'unk',
          building: '0',
          buildingId: '0',
          entrance: '0',
          entranceId: '0',
          apartment: '0',
          apartmentId: '0',
          registrationDate: new Date().toISOString()
        };

        await setDoc(userDocRef, newUser);
        set({ user: newUser });
      }
    } catch (error: any) {
      console.error("Google login failed", error);
      throw new Error(error.message || 'Authentication failed');
    }
  }
}));
