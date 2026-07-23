import { useAuthStore } from '../store/useAuthStore';

export const triggerGamification = async (action: 'daily_login' | 'post' | 'comment' | 'match') => {
  const user = useAuthStore.getState().user;
  if (!user || user.role === 'guest') return;

  try {
    const res = await fetch('/api/gamification/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: user.uid,
        action
      })
    });
    const data = await res.json();
    
    // If we get mocked: true, we could optionally update local state so the user sees changes immediately in preview
    if (data.mocked) {
      console.log("Gamification is mocked, updating local state for preview only.");
      // We will do a local update to the store for preview purposes
      let { points = 0, badges = [], currentStreak = 0, lastDailyLoginDate } = user;
      let pointsToAdd = 0;
      let newBadges: string[] = [];
      const today = new Date().toISOString().split('T')[0];

      if (action === 'daily_login') {
        if (lastDailyLoginDate === today) return;
        pointsToAdd = 10;
        if (lastDailyLoginDate) {
          const last = new Date(lastDailyLoginDate);
          const curr = new Date(today);
          const diffDays = Math.ceil(Math.abs(curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) currentStreak += 1;
          else if (diffDays > 1) currentStreak = 1;
        } else {
          currentStreak = 1;
        }
        lastDailyLoginDate = today;
        if (currentStreak >= 7 && !badges.includes('7_day_streak')) newBadges.push('7_day_streak');
      } else if (action === 'post') {
        pointsToAdd = 5;
        if (!badges.includes('first_word')) newBadges.push('first_word');
      } else if (action === 'comment') {
        pointsToAdd = 2;
      } else if (action === 'match') {
        pointsToAdd = 15;
        if (!badges.includes('soulmate')) newBadges.push('soulmate');
      }
      points += pointsToAdd;
      if (points >= 100 && !badges.includes('quarter_support')) newBadges.push('quarter_support');
      
      const updates: any = {};
      if (pointsToAdd > 0) updates.points = points;
      if (newBadges.length > 0) updates.badges = [...badges, ...newBadges];
      if (action === 'daily_login') {
        updates.currentStreak = currentStreak;
        updates.lastDailyLoginDate = lastDailyLoginDate;
      }
      
      // Update local zustand state ONLY (don't write to firestore to avoid rule failure)
      useAuthStore.getState().setUser({ ...user, ...updates });
    }
  } catch (error) {
    console.error("Failed to trigger gamification:", error);
  }
};
