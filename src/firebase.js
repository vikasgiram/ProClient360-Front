import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


navigator.serviceWorker
  .register("/firebase-messaging-sw.js")
  .then((registration) => {
    console.log("Service Worker registered:", registration);
  })
  .catch((error) => {
    console.error("Service Worker registration failed:", error);
  });

// Request Notification Permission
const requestForToken = async () => {
  try {
    const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
    if (token) {
      console.log("FCM Token:", token);
      localStorage.setItem("fcmToken", token);
    } else {
      console.log("No registration token available.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
  }
};

// Listen for Messages
const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
  });

  export { messaging, requestForToken, onMessageListener };
