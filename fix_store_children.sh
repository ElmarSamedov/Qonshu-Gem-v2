sed -i '/district: string;/a\
  childrenCount?: number;\
  childrenAges?: string;\
  nationality?: string;' src/store/useAuthStore.ts
