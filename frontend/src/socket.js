import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create socket instance with better error handling
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

// Debug logging
const debug = (...args) => {
  console.log('[Socket]', ...args);
};

// Add connection event listeners for debugging
socket.on('connect', () => {
  debug('Connected successfully with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  debug('Connection error:', error);
});

socket.on('disconnect', (reason) => {
  debug('Disconnected:', reason);
});

// Socket connection status
let isConnected = false;

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
  isConnected = true;
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  isConnected = false;
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  isConnected = false;
});

// Helper functions
export const createRoom = (playerName, roomName = '') => {
  if (!isConnected) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('createRoom', { playerName, roomName });
};

export const joinRoom = (roomId, playerName) => {
  if (!isConnected) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('joinRoom', { roomId, playerName });
};

export const startGame = (roomId, duration = 60) => {
  if (!isConnected) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('startGame', { roomId, duration });
};

export const submitWord = (roomId, word) => {
  if (!isConnected) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('wordTyped', { roomId, word });
};

export const resetGame = (roomId) => {
  if (!isConnected) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('resetGame', { roomId });
};

export const leaveRoom = () => {
  if (!isConnected) {
    console.error('Socket not connected');
    return;
  }
  socket.emit('leaveRoom');
};

export const getConnectionStatus = () => {
  return isConnected;
};

// Export the socket instance
export default socket;
