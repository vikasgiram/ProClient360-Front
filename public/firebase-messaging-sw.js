importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBWzady7uLVuz-JdzsyCNnQWOmnHY-WJuI",
  authDomain: "projectmanagement-9bfc4.firebaseapp.com",
  projectId: "projectmanagement-9bfc4",
  storageBucket: "projectmanagement-9bfc4.firebasestorage.app",
  messagingSenderId: "969376649444",
  appId: "1:969376649444:web:460182850ddf5ca5511cf1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.image || "/logo192.png",
  });
});
