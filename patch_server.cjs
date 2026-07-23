const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newEndpoint = `
  // Resolve mutual aid request
  app.post("/api/mutual-aid/resolve", async (req, res) => {
    try {
      const { requestId, helperId, recipientId, district, category } = req.body;
      if (!requestId || !helperId || !recipientId || !district) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!adminInitialized) {
        return res.json({ success: true, mocked: true });
      }

      const db = admin.firestore();
      const requestRef = db.collection('mutual_aid_requests').doc(requestId);
      const helperRef = db.collection('users').doc(helperId);
      const statsRef = db.collection('district_stats').doc(district);
      const goodDeedRef = db.collection('good_deeds').doc();

      await db.runTransaction(async (transaction: any) => {
        const reqDoc = await transaction.get(requestRef);
        if (!reqDoc.exists) throw new Error("Request not found");
        if (reqDoc.data()?.status === 'fulfilled') throw new Error("Already fulfilled");

        transaction.update(requestRef, { status: 'fulfilled' });

        transaction.set(goodDeedRef, {
          helperId,
          recipientId,
          districtId: district,
          category: category || 'general',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          requestId
        });

        transaction.set(statsRef, {
          totalDeeds: admin.firestore.FieldValue.increment(1)
        }, { merge: true });

        // Gamification for helper
        const helperDoc = await transaction.get(helperRef);
        if (helperDoc.exists) {
          const helperData = helperDoc.data();
          let points = helperData?.points || 0;
          let badges = helperData?.badges || [];
          
          points += 20; // Points for helping
          let newBadges = [];
          if (!badges.includes('mutual_aid_helped')) {
            newBadges.push('mutual_aid_helped');
          }
          
          const updates: any = { points };
          if (newBadges.length > 0) {
            updates.badges = [...badges, ...newBadges];
            if (helperData?.fcmToken) {
              sendPushNotification(helperData.fcmToken, 'New Badge Earned!', \`You earned \${newBadges.length} new badge(s)!\`);
            }
          }
          
          transaction.update(helperRef, updates);
        }
      });
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Resolve mutual aid error:", error);
      res.status(500).json({ error: error.message });
    }
  });
`;

content = content.replace('// Gamification engine', newEndpoint + '\n\n  // Gamification engine');

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with mutual-aid resolve endpoint");
