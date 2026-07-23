import { getToken, onMessage } from 'firebase/messaging';
import { messaging, db } from './firebase';
import { useAuthStore } from '../store/useAuthStore';
import { doc, updateDoc } from 'firebase/firestore';

export async function requestNotificationPermission() {
  if (!messaging) return false;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging);
      if (token) {
        const user = useAuthStore.getState().user;
        if (user && user.uid && user.role !== 'guest') {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { fcmToken: token });
          useAuthStore.getState().updateUser({ fcmToken: token });
        }
        return true;
      }
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error);
  }
  return false;
}

export function setupMessageListener() {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
  });
}
