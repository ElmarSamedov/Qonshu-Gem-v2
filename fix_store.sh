sed -i '/trust_rating: number;/a\
  isAnonymous?: boolean;' src/store/useAuthStore.ts
