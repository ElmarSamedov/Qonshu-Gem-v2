const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const safetyLoop = `
  // Safety Check-In Background Job
  if (adminInitialized) {
    setInterval(async () => {
      try {
        const db = admin.firestore();
        const usersSnapshot = await db.collection('users').get();
        
        const now = new Date();
        // Shift to Baku time (UTC+4) approximately for simple comparison
        const bakuTime = new Date(now.getTime() + (4 * 60 * 60 * 1000));
        const todayStr = bakuTime.toISOString().split('T')[0];
        const currentHour = bakuTime.getUTCHours();
        const currentMin = bakuTime.getUTCMinutes();
        const currentTimeStr = \`\${currentHour.toString().padStart(2, '0')}:\${currentMin.toString().padStart(2, '0')}\`;

        usersSnapshot.forEach(async (doc) => {
          const userData = doc.data();
          if (userData.safetyCheckIn && userData.safetyCheckIn.enabled) {
            const safety = userData.safetyCheckIn;
            
            // Check if deadline has passed
            if (currentTimeStr >= safety.deadlineTime) {
               // Check if they missed check-in today
               if (safety.lastCheckInDate !== todayStr) {
                 // Check if we already escalated today
                 if (safety.escalatedDate !== todayStr) {
                    console.log(\`Escalating safety check for \${userData.name}\`);
                    // Send push notification to contacts
                    if (safety.contactUids && safety.contactUids.length > 0) {
                      for (const contactUid of safety.contactUids) {
                         const contactDoc = await db.collection('users').doc(contactUid).get();
                         if (contactDoc.exists) {
                           const contactData = contactDoc.data();
                           if (contactData.fcmToken) {
                             sendPushNotification(contactData.fcmToken, "Safety Check Alert", \`\${userData.name} didn't check in today. Maybe you should check if everything is okay.\`);
                           }
                         }
                      }
                    }
                    
                    // Mark as escalated today
                    await db.collection('users').doc(doc.id).update({
                      'safetyCheckIn.escalatedDate': todayStr
                    });
                 }
               }
            }
          }
        });
      } catch (e) {
        console.error("Safety check loop error:", e);
      }
    }, 60 * 1000); // Check every minute
  }
`;

content = content.replace('  app.listen(PORT', safetyLoop + '\n  app.listen(PORT');

const newApiEndpoints = `
  app.post("/api/safety/request-contact", async (req, res) => {
    try {
      const { contactUid } = req.body;
      if (!contactUid) return res.status(400).json({ error: "Missing contactUid" });
      
      // In a real app, this would send a notification to contactUid to approve
      // For now, we mock success
      res.json({ success: true, mocked: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });
`;

content = content.replace('  // Gamification engine', newApiEndpoints + '\n  // Gamification engine');

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with safety loop and endpoints");
