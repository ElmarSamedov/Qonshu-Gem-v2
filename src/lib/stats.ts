import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export const trackStatsEvent = async (district: string, event: string, data?: any) => {
  try {
    const res = await fetch('/api/stats/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ district, event, data })
    });
    const result = await res.json();
    
    if (result.mocked) {
      // Fallback to client-side
      const statsRef = doc(db, 'district_stats', district);
      const snap = await getDoc(statsRef);
      if (!snap.exists()) {
        await setDoc(statsRef, {
          totalResidents: 0,
          verifiedResidents: 0,
          totalIssuesResolved: 0,
          totalMutualAid: 0,
          topActiveUsers: [],
          interests: {}
        });
      }
      
      const updates: any = {};
      
      if (event === 'user_joined') {
        updates.totalResidents = increment(1);
        if (data?.verified) updates.verifiedResidents = increment(1);
        if (data?.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interestId: string) => {
                        updates['interests.' + interestId] = increment(1);
          });
        }
      } else if (event === 'interests_updated') {
        if (data?.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interestId: string) => {
                        updates['interests.' + interestId] = increment(1);
          });
        }
      } else if (event === 'user_verified') {
        updates.verifiedResidents = increment(1);
      } else if (event === 'issue_resolved') {
        updates.totalIssuesResolved = increment(1);
      } else if (event === 'mutual_aid_completed') {
        updates.totalMutualAid = increment(1);
      }
      
      if (Object.keys(updates).length > 0) {
        await updateDoc(statsRef, updates);
      }
    }
  } catch (error) {
    console.error("Stats fallback error:", error);
  }
};
