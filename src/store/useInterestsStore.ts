import { create } from 'zustand';

export interface InterestNode {
  id: string;
  parent_id: string | null;
  interest_en: string;
  interest_ru: string;
  interest_az: string;
  level: string;
}

interface InterestsState {
  interests: InterestNode[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  fetchInterests: () => Promise<void>;
}

export const useInterestsStore = create<InterestsState>((set, get) => ({
  interests: [],
  loading: false,
  loaded: false,
  error: null,
  fetchInterests: async () => {
    if (get().loaded || get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch('/interests.json');
      if (!res.ok) throw new Error('Failed to fetch interests');
      const data = await res.json();
      set({ interests: data, loaded: true, loading: false });
    } catch (err: any) {
      console.error('Failed to load interests', err);
      set({ error: err.message, loading: false, loaded: false });
    }
  }
}));
