const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
  app.post("/api/stats/event", async (req, res) => {
    try {
      const { district, event, data } = req.body;
      if (!district || !event) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (!adminInitialized) return res.json({ success: true, mocked: true });

      const db = admin.firestore();
      const statsRef = db.collection('district_stats').doc(district);
      
      const updates: any = {};
      
      if (event === 'user_joined') {
        updates.totalResidents = admin.firestore.FieldValue.increment(1);
        if (data?.verified) {
          updates.verifiedResidents = admin.firestore.FieldValue.increment(1);
        }
        if (data?.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interestId: string) => {
            updates[\`interests.\${interestId}\`] = admin.firestore.FieldValue.increment(1);
          });
        }
      } else if (event === 'user_verified') {
        updates.verifiedResidents = admin.firestore.FieldValue.increment(1);
      } else if (event === 'post_published') {
        updates.totalPosts = admin.firestore.FieldValue.increment(1);
      }
      
      await statsRef.set(updates, { merge: true });
      res.json({ success: true });
    } catch (e) {
      console.error("Stats event error:", e);
      res.status(500).json({ error: "Server error" });
    }
  });

`;

content = content.replace('  app.post("/api/mutual-aid/resolve",', newRoute + '  app.post("/api/mutual-aid/resolve",');
fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with /api/stats/event");
