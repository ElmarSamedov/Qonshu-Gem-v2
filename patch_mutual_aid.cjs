const fs = require('fs');
let content = fs.readFileSync('src/components/MutualAid.tsx', 'utf8');

const regex = /if \(data\.mocked\) \{\n          alert\('Server configured in preview mode \\(missing Service Account\\)\. Points and badges were not officially awarded, but the request will appear resolved\.'\);\n          \/\/ We can at least resolve the request locally on the client for UX\n          const \{ doc, updateDoc \} = await import\('firebase\/firestore'\);\n          await updateDoc\(doc\(db, 'mutual_aid_requests', resolveDialogReq\.id\), \{ status: 'resolved' \}\);\n        \}/;

const replacement = `if (data.mocked) {
          console.warn('Server configured in preview mode. Points were not officially awarded to the helper.');
          const { doc, updateDoc, setDoc, collection } = await import('firebase/firestore');
          await updateDoc(doc(db, 'mutual_aid_requests', resolveDialogReq.id), { status: 'resolved' });
          try {
            await setDoc(doc(collection(db, 'good_deeds')), {
              helperId,
              recipientId: user.uid,
              district: user.district || 'Unknown',
              category: resolveDialogReq.type,
              createdAt: new Date().toISOString(),
              requestId: resolveDialogReq.id
            });
            // Update stats
            const statsRef = doc(db, 'district_stats', user.district || 'Unknown');
            const { increment } = await import('firebase/firestore');
            await updateDoc(statsRef, { totalDeeds: increment(1) }).catch(e => {
              // Create if not exists
              setDoc(statsRef, { totalDeeds: 1 }, { merge: true });
            });
          } catch (e) {
            console.error('Fallback update failed:', e);
          }
        }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/MutualAid.tsx', content);
console.log("Patched MutualAid fallback");
