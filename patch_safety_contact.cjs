const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.post\("\/api\/safety\/request-contact", async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: e\.message \}\);\n    \}\n  \}\);/;

const replacement = `app.post("/api/safety/request-contact", async (req, res) => {
    try {
      const { contactUid, requesterUid, requesterName } = req.body;
      if (!contactUid || !requesterUid) return res.status(400).json({ error: "Missing contactUid or requesterUid" });
      
      if (!adminInitialized) return res.json({ success: true, mocked: true });
      
      const db = admin.firestore();
      
      // Send notification to contact
      await db.collection('notifications').add({
        userId: contactUid,
        type: 'safety_contact_request',
        title: 'Safety Contact Request',
        message: \`\${requesterName || 'A neighbor'} wants to add you as a safety emergency contact.\`,
        requesterUid: requesterUid,
        requesterName: requesterName,
        read: false,
        timestamp: new Date().toISOString()
      });

      // Update pendingContactUids for requester
      const userRef = db.collection('users').doc(requesterUid);
      
      // Since it's nested in safetyCheckIn, we update the specific field
      // We will first get the user doc, then update it. It's safer.
      const docSnap = await userRef.get();
      if (docSnap.exists) {
        const userData = docSnap.data();
        let safetyCheckIn = userData.safetyCheckIn || {};
        let pending = safetyCheckIn.pendingContactUids || [];
        if (!pending.includes(contactUid)) {
          pending.push(contactUid);
        }
        safetyCheckIn.pendingContactUids = pending;
        await userRef.update({ safetyCheckIn });
      }

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });`;

content = content.replace(regex, replacement);
fs.writeFileSync('server.ts', content);
console.log("Patched server.ts for request-contact");
