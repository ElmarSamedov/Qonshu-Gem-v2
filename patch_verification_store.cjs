const fs = require('fs');
let content = fs.readFileSync('src/store/useVerificationStore.ts', 'utf8');

const importRegex = /import \{ getDoc \} from 'firebase\/firestore';/;
const importReplacement = `import { getDoc } from 'firebase/firestore';
import { calculateNewTrustScores } from '../lib/trustScores';`;
content = content.replace(importRegex, importReplacement);

const approveRegex = /approveRequest: async \(id\) => \{[\s\S]*?\}\n    \}\n  \},/;
const approveReplacement = `approveRequest: async (id) => {
    const request = get().requests.find(r => r.id === id);
    if (request) {
      try {
        const userRef = doc(db, 'users', request.userId);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          let targetLocId = request.locationId;
          const locations = userData.locations || [];
          
          if (!locations.some((loc: any) => loc.id === request.locationId) && locations.length > 0) {
            targetLocId = userData.activeLocationId || locations[0].id;
          }

          const newLocations = locations.map((loc: any) => {
            if (loc.id === targetLocId) {
              return { ...loc, verified: true, verification_method: 'docs' };
            }
            return loc;
          });

          const hasVerifiedLocation = newLocations.some((l: any) => l.verified);
          
          const currentLevel = userData.trust_level || 0;
          const currentScores = userData.trust_scores || { identity: 0, location: 0, community: 0, overall: 0 };
          
          const { trust_level, trust_scores } = calculateNewTrustScores(currentLevel, currentScores, hasVerifiedLocation);
          const is_verified = hasVerifiedLocation || (trust_scores.identity > 30);
          
          await updateDoc(userRef, {
            locations: newLocations,
            trust_level,
            trust_scores,
            is_verified
          });
        }
        
        await updateDoc(doc(db, 'verification_requests', id), { status: 'approved' });
      } catch (e) {
        console.error('Failed to approve verification request:', e);
      }
    }
  },`;
content = content.replace(approveRegex, approveReplacement);

fs.writeFileSync('src/store/useVerificationStore.ts', content);
console.log("Patched useVerificationStore.ts");
