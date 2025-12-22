import AllRoutes from './AllRoutes';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { initMessaging, requestForToken, onMessageListener } from './firebase';
import './App.css';
import { UserProvider } from './context/UserContext';

function App() {

  useEffect(() => {
    const setupFirebaseMessaging = async () => {
      try {
        // Initialize messaging first
        const messaging = await initMessaging();
        
        if (messaging) {
          // Request permission and get token
          const token = await requestForToken();
          
          if (token) {
            console.log('Firebase Messaging initialized successfully');
            
            // Listen for messages
            onMessageListener()
              .then(payload => {
                console.log("Notification received:", payload);
                if (payload.notification?.title) {
                  alert(payload.notification.title);
                }
              })
              .catch(err => {
                console.error('Error listening for messages:', err);
              });
          } else {
            console.log('Failed to get FCM token');
          }
        } else {
          console.log('Firebase Messaging not available (requires HTTPS or localhost)');
        }
      } catch (error) {
        console.error('Error setting up Firebase Messaging:', error);
      }
    };

    setupFirebaseMessaging();
  }, []);

  return (
    <>
      <UserProvider>
        <AllRoutes />
        <Toaster />
      </UserProvider>
    </>
  );
}

export default App;