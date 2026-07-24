const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

content = content.replace(
  'interface AuthState {\n  user: User | null;',
  'interface AuthState {\n  user: User | null;\n  isAuthenticated: boolean;\n  isAuthLoaded: boolean;'
);

content = content.replace(
  'export const useAuthStore = create<AuthState>((set, get) => ({\n  user: createGuestUser(), // Start as guest',
  'export const useAuthStore = create<AuthState>((set, get) => ({\n  user: null,\n  isAuthenticated: false,\n  isAuthLoaded: false,'
);

content = content.replace(
  'setUser: (user) => set({ user }),',
  'setUser: (user) => set({ user, isAuthenticated: user ? user.role !== \'guest\' : false }),'
);

content = content.replace(
  'set({ user: updatedUser });',
  'set({ user: updatedUser, isAuthenticated: updatedUser.role !== \'guest\' });'
);

content = content.replace(
  /createGuestSession: \(\) => set\(\{ user: createGuestUser\(\) \}\),/g,
  'createGuestSession: () => set({ user: createGuestUser(), isAuthenticated: false }),'
);

content = content.replace(
  /set\(\{ user: existingUser \}\);/g,
  'set({ user: existingUser, isAuthenticated: existingUser.role !== \'guest\' });'
);

content = content.replace(
  /set\(\{ user: newUser \}\);/g,
  'set({ user: newUser, isAuthenticated: newUser.role !== \'guest\' });'
);

content = content.replace(
  /set\(\{\n\s*user: \{\n\s*uid: firebaseUser.uid,/g,
  'set({\n            isAuthenticated: true,\n            user: {\n              uid: firebaseUser.uid,'
);

content = content.replace(
  /set\(\{ user: userDocSnap.data\(\) as User \}\);/g,
  'set({ user: userDocSnap.data() as User, isAuthenticated: true, isAuthLoaded: true });'
);

content = content.replace(
  'set({ user: createGuestUser() });',
  'set({ user: null, isAuthenticated: false, isAuthLoaded: true });'
);

fs.writeFileSync('src/store/useAuthStore.ts', content);
console.log("Patched useAuthStore.ts");
