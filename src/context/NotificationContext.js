import React, { createContext, useState, useEffect } from 'react';
import socket from '../services/socket';
import { getNotifications } from '../hooks/useNotification';

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const notifications = await getNotifications();
    console.log("notifications",notifications);
    setNotifications(notifications);
    setLoading(false);
    };

  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();
    // Listen for new notifications via Socket.IO
    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]); // Add new notification to the list
    });

    return () => {
      socket.off('notification'); // Clean up Socket.IO listener
    };
  }, []);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, isSeen: true } : notif
      )
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead, loading }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
