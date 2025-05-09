import { io } from 'socket.io-client';

// Initialize the socket connection
const socket = io(process.env.REACT_APP_API_URL, {
  auth: {
    token: localStorage.getItem('token'), 
  },
});

socket.on('connect', () => {
  console.log('Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

export default socket;
