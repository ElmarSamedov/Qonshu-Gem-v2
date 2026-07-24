const fs = require('fs');
let content = fs.readFileSync('src/components/Notifications.tsx', 'utf8');

const importRegex = /import \{ useChatStore \} from '\.\.\/store\/useChatStore';/;
const importReplacement = `import { useChatStore } from '../store/useChatStore';
import { getDoc } from 'firebase/firestore';`;

content = content.replace(importRegex, importReplacement);

const handleOpenChatRegex = /const unreadNotifs = notifications\.filter/;

const handleAcceptContact = `
  const handleAcceptContact = async (notif: any) => {
    if (!user || !notif.requesterUid) return;
    try {
      // Add requester to current user's contact list
      const userRef = doc(db, 'users', user.uid);
      const requesterRef = doc(db, 'users', notif.requesterUid);
      
      const userSnap = await getDoc(userRef);
      const requesterSnap = await getDoc(requesterRef);
      
      if (requesterSnap.exists()) {
        const requesterData = requesterSnap.data();
        let safetyCheckIn = requesterData.safetyCheckIn || {};
        let contactUids = safetyCheckIn.contactUids || [];
        let pending = safetyCheckIn.pendingContactUids || [];
        
        if (!contactUids.includes(user.uid)) contactUids.push(user.uid);
        pending = pending.filter((id: string) => id !== user.uid);
        
        safetyCheckIn.contactUids = contactUids;
        safetyCheckIn.pendingContactUids = pending;
        
        await updateDoc(requesterRef, { safetyCheckIn });
      }
      
      markAsRead(notif.id);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadNotifs = notifications.filter`;

content = content.replace(handleOpenChatRegex, handleAcceptContact);


const notifContentRegex = /\{notif\.type === 'mutual_signal_match' && \([\s\S]*?<\/div>\s*\)\}/;
const notifContentReplacement = `{notif.type === 'mutual_signal_match' && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleOpenChat(notif)}
                        className="flex items-center justify-center w-full text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 mr-1.5" /> Start Chat
                      </button>
                    </div>
                  )}

                  {notif.type === 'safety_contact_request' && (
                    <div className="mt-3 flex space-x-2">
                      <button
                        onClick={() => handleAcceptContact(notif)}
                        className="flex-1 flex justify-center items-center text-xs bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="flex-1 flex justify-center items-center text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}`;

content = content.replace(notifContentRegex, notifContentReplacement);

fs.writeFileSync('src/components/Notifications.tsx', content);
console.log("Patched Notifications.tsx for safety");
