const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const isGuest = user\?.role === 'guest';/g;
const replacement = `const { isAuthenticated, isAuthLoaded } = useAuthStore();
  const isGuest = user?.role === 'guest' || !isAuthenticated;
  
  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }`;
content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx");
