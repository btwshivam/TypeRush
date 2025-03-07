require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const challengeRoutes = require('./routes/challengeRoutes');

// Initialize express
const app = express();
const server = http.createServer(app);

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
};

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Rooms management with Map for better performance
const rooms = new Map();
const userSockets = new Map();

// Word lists by difficulty
const wordLists = {
  easy: [
    'function', 'variable', 'array', 'string', 'number', 'boolean', 
    'object', 'class', 'method', 'property', 'value', 'type',
    'loop', 'if', 'else', 'switch', 'case', 'break', 'return',
    'import', 'export', 'const', 'let', 'var', 'this', 'new'
  ],
  medium: [
    'promise', 'async', 'await', 'callback', 'closure', 'prototype',
    'inheritance', 'component', 'state', 'props', 'effect', 'hook',
    'middleware', 'reducer', 'action', 'store', 'context', 'provider',
    'consumer', 'fragment', 'portal', 'memo', 'ref', 'forward'
  ],
  hard: [
    'polymorphism', 'encapsulation', 'abstraction', 'asynchronous',
    'recursion', 'memoization', 'algorithm', 'optimization', 'complexity',
    'authentication', 'authorization', 'serialization', 'deserialization',
    'virtualization', 'containerization', 'microservice', 'monolithic'
  ]
};

// Generate a random word with difficulty
const generateWord = () => {
  const difficulties = ['easy', 'medium', 'hard'];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  const wordList = wordLists[difficulty];
  const word = wordList[Math.floor(Math.random() * wordList.length)];
  
  return { word, difficulty };
};

// Generate a set of words
const generateWords = (count = 20) => {
  return Array.from({ length: count }, () => generateWord());
};

// Debug logging function
const debug = (...args) => {
  console.log(new Date().toISOString(), ...args);
};

// Socket event handlers
io.on('connection', (socket) => {
  debug('User connected:', socket.id);

  // Create a room
  socket.on('createRoom', ({ name }) => {
    try {
      debug(`${name} creating a new room`);
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Send the room ID to the client
      socket.emit('roomCreated', { room: roomId });
      debug(`Room created: ${roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('roomError', { message: 'Failed to create room' });
    }
  });

  // Join a room
  socket.on('joinRoom', ({ room, name }) => {
    try {
      debug(`${name} attempting to join room ${room}`);
      
      let currentRoom = rooms.get(room);
      if (!currentRoom) {
        currentRoom = {
          id: room,
          players: [],
          gameStarted: false,
          words: [],
          scores: {},
          createdAt: Date.now()
        };
        rooms.set(room, currentRoom);
        debug(`New room created: ${room}`);
      }

      // Check if player name already exists in room
      const nameExists = currentRoom.players.some(p => p.name === name);
      if (nameExists) {
        debug(`Name ${name} already taken in room ${room}`);
        socket.emit('roomError', { message: 'Name already taken in this room' });
        return;
      }

      // Check if game is in progress
      if (currentRoom.gameStarted) {
        debug(`Game already in progress in room ${room}`);
        socket.emit('roomError', { message: 'Game already in progress' });
        return;
      }

      const player = {
        id: socket.id,
        name,
        score: 0,
        isLeader: currentRoom.players.length === 0
      };

      currentRoom.players.push(player);
      socket.join(room);
      userSockets.set(socket.id, { room, name });

      debug(`${name} joined room ${room}, total players: ${currentRoom.players.length}`);

      // Send room data to all players
      io.to(room).emit('updatePlayers', currentRoom.players);

      // Send success message to the player who joined
      socket.emit('roomJoined', {
        room,
        players: currentRoom.players,
        isLeader: player.isLeader
      });
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('roomError', { message: 'Failed to join room' });
    }
  });

  // Start game
  socket.on('startGame', ({ room, duration = 60 }) => {
    try {
      debug(`Starting game in room ${room} with duration ${duration}s`);
      const currentRoom = rooms.get(room);
      
      if (!currentRoom) {
        debug(`Room ${room} not found`);
        socket.emit('roomError', { message: 'Room not found' });
        return;
      }

      // Check if user is the leader
      const player = currentRoom.players.find(p => p.id === socket.id);
      if (!player || !player.isLeader) {
        debug(`Non-leader ${socket.id} attempted to start game in room ${room}`);
        socket.emit('roomError', { message: 'Only the room leader can start the game' });
        return;
      }

      if (currentRoom.players.length < 2) {
        debug(`Not enough players in room ${room}`);
        socket.emit('roomError', { message: 'Need at least 2 players to start a game' });
        return;
      }

      currentRoom.gameStarted = true;
      currentRoom.words = generateWords(30);
      currentRoom.startTime = Date.now();
      currentRoom.duration = duration;
      currentRoom.scores = {};
      
      currentRoom.players.forEach(player => {
        currentRoom.scores[player.id] = { 
          name: player.name, 
          score: 0
        };
      });

      debug(`Game started in room ${room} with ${currentRoom.words.length} words`);

      // Send game data to all players in the room
      io.to(room).emit('startGame', {
        words: currentRoom.words,
        timer: duration
      });

      // End game after duration
      setTimeout(() => {
        if (currentRoom && currentRoom.gameStarted) {
          endGame(room);
        }
      }, duration * 1000 + 1000); // Add 1 second buffer
    } catch (error) {
      console.error('Error starting game:', error);
      socket.emit('roomError', { message: 'Failed to start game' });
    }
  });

  // Handle word typing
  socket.on('wordTyped', ({ room, word }) => {
    try {
      const currentRoom = rooms.get(room);
      if (!currentRoom || !currentRoom.gameStarted) {
        return;
      }

      const wordObj = currentRoom.words.find(w => w.word === word);
      if (!wordObj) {
        return;
      }

      // Calculate score based on difficulty
      const scoreValue = {
        'easy': 1,
        'medium': 2,
        'hard': 3
      }[wordObj.difficulty] || 1;

      // Update player's score
      const playerScore = currentRoom.scores[socket.id];
      if (playerScore) {
        playerScore.score += scoreValue;
        debug(`Player ${socket.id} typed word "${word}" in room ${room}, new score: ${playerScore.score}`);
      }
      
      // Remove typed word and add new one
      const index = currentRoom.words.indexOf(wordObj);
      currentRoom.words.splice(index, 1);
      currentRoom.words.push(generateWord());

      // Send updated words and scores to all players
      io.to(room).emit('updateWords', {
        newWords: currentRoom.words,
        scores: currentRoom.scores
      });
    } catch (error) {
      console.error('Error in wordTyped:', error);
    }
  });

  // End game
  socket.on('endGame', ({ room }) => {
    endGame(room);
  });

  // End game function
  const endGame = (room) => {
    try {
      const currentRoom = rooms.get(room);
      if (!currentRoom) return;

      debug(`Ending game in room ${room}`);
      currentRoom.gameStarted = false;
      
      // Calculate final scores and speeds
      const speeds = {};
      Object.keys(currentRoom.scores).forEach(id => {
        const timeElapsed = (Date.now() - currentRoom.startTime) / 1000 / 60; // in minutes
        speeds[id] = Math.round((currentRoom.scores[id].score * 60) / (currentRoom.duration || 60));
      });

      // Send game over event with results
      io.to(room).emit('gameOver', {
        winners: Object.keys(currentRoom.scores).sort((a, b) => 
          currentRoom.scores[b].score - currentRoom.scores[a].score
        ).slice(0, 3),
        scores: currentRoom.scores,
        speeds
      });

      // Reset room state
      currentRoom.words = [];
      currentRoom.startTime = null;
    } catch (error) {
      console.error('Error in endGame:', error);
    }
  };

  // Leave room
  socket.on('leaveRoom', () => {
    handlePlayerDisconnect(socket);
  });

  // Handle player disconnect
  const handlePlayerDisconnect = (socket) => {
    try {
      const userSocket = userSockets.get(socket.id);
      if (!userSocket) return;

      const { room, name } = userSocket;
      debug(`${name} (${socket.id}) leaving room ${room}`);
      
      const currentRoom = rooms.get(room);
      if (!currentRoom) return;

      // Remove player from room
      const playerIndex = currentRoom.players.findIndex(p => p.id === socket.id);
      if (playerIndex === -1) return;

      const wasLeader = currentRoom.players[playerIndex].isLeader;
      currentRoom.players.splice(playerIndex, 1);
      
      // Delete empty rooms
      if (currentRoom.players.length === 0) {
        debug(`Room ${room} is now empty, deleting`);
        rooms.delete(room);
      } else {
        // Reassign leader if necessary
        if (wasLeader && currentRoom.players.length > 0) {
          currentRoom.players[0].isLeader = true;
          debug(`New leader in room ${room}: ${currentRoom.players[0].name}`);
        }

        // Notify remaining players
        io.to(room).emit('updatePlayers', currentRoom.players);
      }

      // Leave the socket room
      socket.leave(room);
      userSockets.delete(socket.id);
    } catch (error) {
      console.error('Error in handlePlayerDisconnect:', error);
    }
  };

  // Handle disconnect
  socket.on('disconnect', () => {
    debug('User disconnected:', socket.id);
    handlePlayerDisconnect(socket);
  });
});

// Clean up old rooms periodically (every hour)
setInterval(() => {
  const now = Date.now();
  let cleanedRooms = 0;
  
  for (const [roomId, room] of rooms.entries()) {
    // Remove rooms older than 3 hours with no activity
    if (now - room.createdAt > 3 * 60 * 60 * 1000 && room.players.length === 0) {
      rooms.delete(roomId);
      cleanedRooms++;
    }
  }
  
  if (cleanedRooms > 0) {
    debug(`Cleaned up ${cleanedRooms} inactive rooms`);
  }
}, 60 * 60 * 1000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// API Routes
app.use('/api/challenges', challengeRoutes);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
