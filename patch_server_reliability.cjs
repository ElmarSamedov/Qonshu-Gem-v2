const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /\/\/ Gamification for helper[\s\S]*?transaction\.update\(helperRef, updates\);\n        \}/;

const replacement = `// Gamification for helper
        const helperDoc = await transaction.get(helperRef);
        if (helperDoc.exists) {
          const helperData = helperDoc.data();
          let points = helperData?.points || 0;
          let reliabilityScore = helperData?.reliabilityScore || 0;
          let badges = helperData?.badges || [];
          
          points += 20; // Points for helping
          reliabilityScore += 10; // Silent reliability score for mutual aid

          let newBadges = [];
          if (!badges.includes('mutual_aid_helped')) {
            newBadges.push('mutual_aid_helped');
          }
          
          if (reliabilityScore >= 50 && !badges.includes('trusted_gold')) {
            newBadges.push('trusted_gold');
          } else if (reliabilityScore >= 20 && !badges.includes('trusted_silver')) {
            newBadges.push('trusted_silver');
          } else if (reliabilityScore >= 10 && !badges.includes('trusted_bronze')) {
            newBadges.push('trusted_bronze');
          }
          
          const updates: any = { points, reliabilityScore };
          if (newBadges.length > 0) {
            updates.badges = [...badges, ...newBadges];
            if (helperData?.fcmToken) {
              sendPushNotification(helperData.fcmToken, 'New Badge Earned!', \`You earned \${newBadges.length} new badge(s)!\`);
            }
          }
          
          transaction.update(helperRef, updates);
        }`;

content = content.replace(regex, replacement);

const newSilentEndpoint = `
  app.post("/api/gamification/silent-action", async (req, res) => {
    try {
      const { targetUid, action } = req.body;
      if (!targetUid || !action) {
        return res.status(400).json({ error: "Missing targetUid or action" });
      }
      if (!adminInitialized) return res.json({ success: true, mocked: true });

      const db = admin.firestore();
      const userRef = db.collection('users').doc(targetUid);
      
      await db.runTransaction(async (transaction: any) => {
        const doc = await transaction.get(userRef);
        if (!doc.exists) return;
        
        const userData = doc.data() || {};
        let reliabilityScore = userData.reliabilityScore || 0;
        let badges = userData.badges || [];
        let newBadges = [];
        
        let scoreToAdd = 0;
        if (action === 'recommendation_helpful') scoreToAdd = 2;
        if (action === 'neighbor_verification') scoreToAdd = 5;
        
        if (scoreToAdd > 0) {
          reliabilityScore += scoreToAdd;
          
          if (reliabilityScore >= 50 && !badges.includes('trusted_gold')) {
            newBadges.push('trusted_gold');
          } else if (reliabilityScore >= 20 && !badges.includes('trusted_silver')) {
            newBadges.push('trusted_silver');
          } else if (reliabilityScore >= 10 && !badges.includes('trusted_bronze')) {
            newBadges.push('trusted_bronze');
          }
          
          const updates: any = { reliabilityScore };
          if (newBadges.length > 0) {
            updates.badges = [...badges, ...newBadges];
            if (userData.fcmToken) {
              sendPushNotification(userData.fcmToken, 'New Trust Badge!', \`Neighbors trust you!\`);
            }
          }
          transaction.update(userRef, updates);
        }
      });
      res.json({ success: true });
    } catch (e: any) {
      console.error("Silent action error:", e);
      res.status(500).json({ error: e.message });
    }
  });
`;

content = content.replace('  // Gamification engine', newSilentEndpoint + '\n  // Gamification engine');

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with reliabilityScore and silent-action");
