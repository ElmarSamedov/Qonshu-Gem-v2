const fs = require('fs');
let content = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

// Patch 1: After user registration
content = content.replace(
  '      await setDoc(userDocRef, newUser);\n      set({ user: newUser });',
  `      await setDoc(userDocRef, newUser);\n      set({ user: newUser });\n\n      // Dispatch stats event\n      try {\n        fetch('/api/stats/event', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ district, event: 'user_joined', data: { verified: false, interests: newUser.discoverableInterests || [] } })\n        });\n      } catch (e) { console.error('Stats error:', e); }`
);

// Patch 2: After user location verification
content = content.replace(
  '      await setDoc(doc(db, \'users\', user.uid), updatedUser);\n    } catch (e) {\n      console.error(\'Failed to sync verified location to Firestore:\', e);\n    }',
  `      await setDoc(doc(db, 'users', user.uid), updatedUser);\n      \n      if (hasVerifiedLocation && !user.is_verified) {\n        fetch('/api/stats/event', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ district: updatedUser.district, event: 'user_verified' })\n        }).catch(e => console.error(e));\n      }\n    } catch (e) {\n      console.error('Failed to sync verified location to Firestore:', e);\n    }`
);

// Patch 3: After updateUser with new interests
content = content.replace(
  '      if (updates.discoverableInterests && user.district) {',
  `      if (updates.discoverableInterests && user.district) {\n        fetch('/api/stats/event', {\n          method: 'POST',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ district: user.district, event: 'user_joined', data: { interests: updates.discoverableInterests } })\n        }).catch(console.error);`
);

fs.writeFileSync('src/store/useAuthStore.ts', content);
console.log("Patched useAuthStore.ts for stats");
