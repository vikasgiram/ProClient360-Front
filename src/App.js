
import AllRoutes from './AllRoutes';
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react';
import { requestForToken, onMessageListener } from './firebase';
import './App.css';
import { UserProvider } from './context/UserContext';

function App() {

  useEffect(() => {
    requestForToken();                // this is used in the request for permissin
  }, []);

  onMessageListener().then(payload => {
    console.log("Notification received:", payload);
    alert(payload.notification.title);                 
  });

  return (
    <>
      <UserProvider>
          <AllRoutes />
          <Toaster/>
      </UserProvider>
    </>
  );
}

export default App;
