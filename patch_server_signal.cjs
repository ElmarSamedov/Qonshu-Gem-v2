const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const newRoute = `
  app.post("/api/signal", async (req, res) => {
    if (!adminInitialized) return res.status(500).json({ error: "Firebase Admin not initialized" });
    const { fromUid, toUid } = req.body;
    
    if (!fromUid || !toUid) {
      return res.status(400).json({ error: "Missing uids" });
    }

    try {
      const db = admin.firestore();
      
      const existingSignalQ = await db.collection("signals")
        .where("fromUid", "==", toUid)
        .where("toUid", "==", fromUid)
        .limit(1)
        .get();

      if (!existingSignalQ.empty) {
        const existingSignalDoc = existingSignalQ.docs[0];
        await existingSignalDoc.ref.update({ matched: true });
        
        await db.collection("signals").add({
          fromUid,
          toUid,
          createdAt: new Date().toISOString(),
          matched: true
        });

        await db.collection("notifications").add({
          userId: fromUid,
          type: "mutual_signal_match",
          title: "Mutual Match! 🎉",
          message: "A neighbor you waved at waved back! You can now chat.",
          matchedUserId: toUid,
          read: false,
          timestamp: new Date().toISOString()
        });

        await db.collection("notifications").add({
          userId: toUid,
          type: "mutual_signal_match",
          title: "Mutual Match! 🎉",
          message: "A neighbor you waved at waved back! You can now chat.",
          matchedUserId: fromUid,
          read: false,
          timestamp: new Date().toISOString()
        });

        return res.json({ matched: true });
      } else {
        const mySignalQ = await db.collection("signals")
          .where("fromUid", "==", fromUid)
          .where("toUid", "==", toUid)
          .limit(1)
          .get();

        if (mySignalQ.empty) {
          await db.collection("signals").add({
            fromUid,
            toUid,
            createdAt: new Date().toISOString(),
            matched: false
          });
        }
        
        return res.json({ matched: false });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Server error" });
    }
  });

`;

content = content.replace('  app.post("/api/mutual-aid/resolve",', newRoute + '  app.post("/api/mutual-aid/resolve",');

fs.writeFileSync('server.ts', content);
console.log("Patched server.ts with /api/signal");
