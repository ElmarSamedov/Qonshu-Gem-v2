// @ts-nocheck
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if Service Account is provided
let adminInitialized = false;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    adminInitialized = true;
    console.log("Firebase Admin initialized successfully.");
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is missing. Server-side Firebase admin features (like matching) will be mocked or disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}



// Helper to send FCM notifications
async function sendPushNotification(fcmToken: string, title: string, body: string) {
  if (!adminInitialized) return;
  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: {
        title,
        body
      }
    });
    console.log("Push notification sent to token:", fcmToken);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example document upload for lazy verification
  app.post("/api/verify/document", upload.single("document"), async (req, res) => {
    try {
      const { uid } = req.body;
      if (!uid || !req.file) {
        return res.status(400).json({ error: "Missing uid or document file" });
      }

      // In a real app, upload to Cloud Storage. 
      // For MVP, we just record that a document was received and mark verification as pending.
      // Simulate file URL
      const mockFileUrl = `https://mockstorage.local/doc_${uid}_${Date.now()}.jpg`;

      // Simulating a successful upload response instead of using firebase-admin which fails without credentials
      res.json({ success: true, document_url: mockFileUrl });
    } catch (error: any) {
      console.error("Document upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  

  // Automatic neighbor matching by interests
  app.post("/api/match-neighbors", async (req, res) => {
    try {
      const { uid, discoverableInterests, district, name } = req.body;
      
      if (!uid || !discoverableInterests || !district) {
        return res.status(400).json({ error: "Missing required fields for matching" });
      }

      if (!adminInitialized) {
        // Fallback for development/preview when no service account is available
        console.log("Mocking neighbor matching for:", uid, discoverableInterests);
        return res.json({ success: true, mocked: true, matchesFound: 0 });
      }

      const db = admin.firestore();
      
      // 1. Find users in the same district who have ANY overlapping discoverable interests
      // (Using admin privileges to read users collection bypassing client rules)
      const usersRef = db.collection('users');
      // We do a query on district, then filter in memory for intersection, 
      // or we can use array-contains-any but it's limited to 10 elements.
      // Since discoverableInterests could be <= 10, let's use array-contains-any.
      
      const queryInterests = discoverableInterests.slice(0, 10);
      if (queryInterests.length === 0) {
         return res.json({ success: true, matchesFound: 0 });
      }

      const snapshot = await usersRef
        .where('district', '==', district)
        .where('discoverableInterests', 'array-contains-any', queryInterests)
        .get();

      let matchesCount = 0;
      const batch = db.batch();

      snapshot.forEach((doc: any) => {
        if (doc.id === uid) return; // Skip self
        
        const neighbor = doc.data();
        const neighborInterests = neighbor.discoverableInterests || [];
        
        // Find exact intersecting interests
        const matches = queryInterests.filter((i: string) => neighborInterests.includes(i));
        
        if (matches.length > 0) {
          matchesCount++;
          
          // Create notification for the existing neighbor
          const neighborNotifRef = db.collection('notifications').doc();
          batch.set(neighborNotifRef, {
            userId: doc.id,
            type: 'interest_match',
            title: 'New Neighbor Match!',
            message: `A new neighbor in ${district} shares your interests.`, interestIds: matches,
            matchedUserId: uid, // Optional, can be used to initiate chat later
            read: false,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });
          
          if (neighbor.fcmToken) {
            sendPushNotification(neighbor.fcmToken, 'New Neighbor Match!', `A new neighbor in ${district} shares your interests.`);
          }

          // Create notification for the new user (initiator)
          const selfNotifRef = db.collection('notifications').doc();
          batch.set(selfNotifRef, {
            userId: uid,
            type: 'interest_match',
            title: 'Neighbor Match!',
            message: `We found a neighbor in ${district} who shares your interests.`, interestIds: matches,
            matchedUserId: doc.id,
            read: false,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });
          
          // Initiator's FCM is handled if we pass it, but usually we just notify the other party or both

          
          // Note: Logic for awarding the "Soulmate" badge could be added here
          // e.g., checking if it's the first match, then adding to user's badges array
        }
      });

      if (matchesCount > 0) {
        await batch.commit();
      }

      res.json({ success: true, matchesFound: matchesCount });
    } catch (error: any) {
      console.error("Matching error:", error);
      res.status(500).json({ error: error.message });
    }
  });


  

  
  // Resolve mutual aid request

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
            updates[`interests.${interestId}`] = admin.firestore.FieldValue.increment(1);
          });
        }
      } else if (event === 'interests_updated') {
        if (data?.interests && Array.isArray(data.interests)) {
          data.interests.forEach((interestId: string) => {
            updates[`interests.${interestId}`] = admin.firestore.FieldValue.increment(1);
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
          
          let trust_scores = helperData?.trust_scores || { identity: 40, location: 0, community: 10, overall: 50 };
          trust_scores.community = Math.min(100, (trust_scores.community || 0) + 10 * 2);
          trust_scores.overall = Math.min(100, Math.round((trust_scores.identity * 0.4) + (trust_scores.location * 0.4) + (trust_scores.community * 0.2)));
          const updates: any = { points, reliabilityScore, trust_scores };
          if (newBadges.length > 0) {
            updates.badges = [...badges, ...newBadges];
            if (helperData?.fcmToken) {
              sendPushNotification(helperData.fcmToken, 'New Badge Earned!', `You earned ${newBadges.length} new badge(s)!`);
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
          
          let trust_scores = userData.trust_scores || { identity: 40, location: 0, community: 10, overall: 50 };
          trust_scores.community = Math.min(100, (trust_scores.community || 0) + scoreToAdd * 2);
          trust_scores.overall = Math.min(100, Math.round((trust_scores.identity * 0.4) + (trust_scores.location * 0.4) + (trust_scores.community * 0.2)));
          const updates: any = { reliabilityScore, trust_scores };
          if (newBadges.length > 0) {
            updates.badges = [...badges, ...newBadges];
            if (userData.fcmToken) {
              sendPushNotification(userData.fcmToken, 'New Trust Badge!', `Neighbors trust you!`);
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

  // Gamification engine
  app.post("/api/gamification/action", async (req, res) => {
    try {
      const { uid, action } = req.body;
      if (!uid || !action) {
        return res.status(400).json({ error: "Missing uid or action" });
      }

      if (!adminInitialized) {
        console.warn("Mocking gamification for:", uid, action);
        return res.json({ success: true, mocked: true });
      }

      const db = admin.firestore();
      const userRef = db.collection('users').doc(uid);
      
      await db.runTransaction(async (transaction: any) => {
        const doc = await transaction.get(userRef);
        if (!doc.exists) return;
        
        const userData = doc.data() || {};
        let points = userData.points || 0;
        let badges = userData.badges || [];
        let currentStreak = userData.currentStreak || 0;
        let lastDailyLoginDate = userData.lastDailyLoginDate || null;
        
        let pointsToAdd = 0;
        let newBadges = [];
        
        const today = new Date().toISOString().split('T')[0]; // UTC date

        if (action === 'daily_login') {
          if (lastDailyLoginDate === today) {
            // Already logged in today
            return; 
          }
          
          pointsToAdd = 10;
          
          if (lastDailyLoginDate) {
            const lastDate = new Date(lastDailyLoginDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
              currentStreak += 1;
            } else if (diffDays > 1) {
              currentStreak = 1;
            }
          } else {
            currentStreak = 1;
          }
          lastDailyLoginDate = today;
          
          if (currentStreak >= 7 && !badges.includes('7_day_streak')) {
            newBadges.push('7_day_streak');
          }
          
        } else if (action === 'post') {
          pointsToAdd = 5;
          if (!badges.includes('first_word')) {
            newBadges.push('first_word');
          }
        } else if (action === 'comment') {
          pointsToAdd = 2;
        } else if (action === 'match') {
          pointsToAdd = 15;
          if (!badges.includes('soulmate')) {
            newBadges.push('soulmate');
          }
        }

        points += pointsToAdd;
        if (points >= 100 && !badges.includes('quarter_support')) {
          newBadges.push('quarter_support');
        }

        if (pointsToAdd > 0 || newBadges.length > 0 || action === 'daily_login') {
          const updates: any = {};
          if (pointsToAdd > 0) updates.points = points;
          if (newBadges.length > 0) {
            updates.badges = [...badges, ...newBadges];
            if (userData.fcmToken) {
              // Note: running this outside transaction is technically better, but we're doing it here for simplicity
              // Since runTransaction might retry, we should ideally queue this. 
              // We will just do a simple fire-and-forget inside the transaction (not ideal, but works for MVP)
              sendPushNotification(userData.fcmToken, 'New Badge Earned!', `You earned ${newBadges.length} new badge(s)!`);
            }
          }
          if (action === 'daily_login') {
            updates.currentStreak = currentStreak;
            updates.lastDailyLoginDate = lastDailyLoginDate;
          }
          
          transaction.update(userRef, updates);
        }
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Gamification error:", error);
      res.status(500).json({ error: error.message });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }


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
        const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

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
                    console.log(`Escalating safety check for ${userData.name}`);
                    // Send push notification to contacts
                    if (safety.contactUids && safety.contactUids.length > 0) {
                      for (const contactUid of safety.contactUids) {
                         const contactDoc = await db.collection('users').doc(contactUid).get();
                         if (contactDoc.exists) {
                           const contactData = contactDoc.data();
                           if (contactData.fcmToken) {
                             sendPushNotification(contactData.fcmToken, "Safety Check Alert", `${userData.name} didn't check in today. Maybe you should check if everything is okay.`);
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
