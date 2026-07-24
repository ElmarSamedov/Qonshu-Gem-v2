const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const routes = `
  app.post("/api/verification/approve", async (req, res) => {
    try {
      const { requestId } = req.body;
      if (!requestId) return res.status(400).json({ error: "Missing requestId" });
      if (!adminInitialized) return res.status(503).json({ error: "Admin not initialized" });

      const db = admin.firestore();
      
      const reqRef = db.collection('verification_requests').doc(requestId);
      const reqSnap = await reqRef.get();
      if (!reqSnap.exists) return res.status(404).json({ error: "Request not found" });
      
      const requestData = reqSnap.data();
      if (requestData.status !== 'pending') return res.status(400).json({ error: "Request is not pending" });

      const userRef = db.collection('users').doc(requestData.userId);
      const userSnap = await userRef.get();
      
      if (userSnap.exists) {
        const userData = userSnap.data();
        let targetLocId = requestData.locationId;
        const locations = userData.locations || [];
        
        if (!locations.some(loc => loc.id === requestData.locationId) && locations.length > 0) {
          targetLocId = userData.activeLocationId || locations[0].id;
        }
        
        const newLocations = locations.map(loc => {
          if (loc.id === targetLocId) {
            return { ...loc, verified: true, verification_method: 'docs' };
          }
          return loc;
        });
        
        const hasVerifiedLocation = newLocations.some(l => l.verified);
        const currentLevel = userData.trust_level || 0;
        const currentScores = userData.trust_scores || { identity: 0, location: 0, community: 0, overall: 0 };
        
        let newLevel = currentLevel;
        let locationScore = currentScores.location;
        if (hasVerifiedLocation) {
          newLevel = Math.max(newLevel, 2);
          locationScore = 80;
        }
        const trust_scores = {
          ...currentScores,
          location: locationScore,
          overall: currentScores.identity + locationScore + currentScores.community
        };
        const is_verified = hasVerifiedLocation || (trust_scores.identity > 30);
        
        await userRef.update({
          locations: newLocations,
          trust_level: newLevel,
          trust_scores: trust_scores,
          is_verified
        });
      }

      await reqRef.update({ status: 'approved' });

      // Add a notification for the user
      await db.collection('notifications').add({
        userId: requestData.userId,
        type: 'system',
        title: 'Verification Approved',
        message: 'Your verification request has been approved. You now have access to verified neighborhood features!',
        read: false,
        timestamp: new Date().toISOString()
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Verification approve error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/verification/reject", async (req, res) => {
    try {
      const { requestId } = req.body;
      if (!requestId) return res.status(400).json({ error: "Missing requestId" });
      if (!adminInitialized) return res.status(503).json({ error: "Admin not initialized" });

      const db = admin.firestore();
      const reqRef = db.collection('verification_requests').doc(requestId);
      const reqSnap = await reqRef.get();
      if (!reqSnap.exists) return res.status(404).json({ error: "Request not found" });

      const requestData = reqSnap.data();
      await reqRef.update({ status: 'rejected' });

      await db.collection('notifications').add({
        userId: requestData.userId,
        type: 'system',
        title: 'Verification Rejected',
        message: 'Your verification request was rejected. Please review our guidelines and try again.',
        read: false,
        timestamp: new Date().toISOString()
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Verification reject error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

`;

content = content.replace("// Vite middleware for development", routes + "\n  // Vite middleware for development");
fs.writeFileSync('server.ts', content);
console.log("Added verification routes");
