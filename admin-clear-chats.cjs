const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore();

async function clearChats() {
  const chatsSnap = await db.collection('chats').get();
  for (const doc of chatsSnap.docs) {
    if (!doc.data().participants) {
      await db.collection('chats').doc(doc.id).delete();
      console.log('Deleted chat missing participants:', doc.id);
    }
  }
}
clearChats().then(() => console.log('Done')).catch(console.error);
