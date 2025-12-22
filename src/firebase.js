import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

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
let messaging = null;

// Initialize messaging only if supported
const initMessaging = async () => {
  try {
    const messagingSupported = await isSupported();
    
    if (messagingSupported && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messaging = getMessaging(app);
      
      // Register Service Worker
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
      
      return messaging;
    } else {
      console.warn("Firebase Messaging not supported in this environment (requires HTTPS or localhost)");
      return null;
    }
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
    return null;
  }
};

// Request Notification Permission
const requestForToken = async () => {
  try {
    if (!messaging) {
      const msg = await initMessaging();
      if (!msg) {
        console.log("Messaging not available - skipping token request");
        return null;
      }
    }
    
    const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY });
    if (token) {
      console.log("FCM Token:", token);
      localStorage.setItem("fcmToken", token);
      return token;
    } else {
      console.log("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
    return null;
  }
};

// Listen for Messages
const onMessageListener = () =>
  new Promise((resolve, reject) => {
    if (!messaging) {
      reject(new Error("Messaging not initialized"));
      return;
    }
    
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
  });

export { app, messaging, requestForToken, onMessageListener, initMessaging };