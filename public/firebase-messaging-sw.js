importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  "projectId": "gen-lang-client-0607506420",
  "appId": "1:438370513804:web:79f3e22f6b4d8be1e21ca9",
  "apiKey": "AIzaSyA25dk4GxK4Mp3ipFdr5n8PmaWv05rW2Xc",
  "authDomain": "gen-lang-client-0607506420.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-cefa64b7-c27b-415f-bc7e-c83bc7760b93",
  "storageBucket": "gen-lang-client-0607506420.firebasestorage.app",
  "messagingSenderId": "438370513804",
  "measurementId": ""
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
