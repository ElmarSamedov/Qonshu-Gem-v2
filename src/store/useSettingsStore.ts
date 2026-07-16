import { create } from 'zustand';

interface SettingsState {
  seniorMode: boolean;
  toggleSeniorMode: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  seniorMode: false,
  toggleSeniorMode: () => set((state) => ({ seniorMode: !state.seniorMode })),
}));
