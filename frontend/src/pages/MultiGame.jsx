import React, { useState, useEffect } from 'react';
import socket from '../socket';
import { FaTrophy, FaUsers, FaKeyboard, FaCrown, FaClock, FaPlay, FaChartLine, FaHeart, FaRedo } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MultiGame = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isLeader, setIsLeader] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedTime, setSelectedTime] = useState(30);
  const [words, setWords] = useState([]);
  const [typedWord, setTypedWord] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [rankings, setRankings] = useState([]);
  const [roomJoined, setRoomJoined] = useState(false);
  const [roomError, setRoomError] = useState('');

  useEffect(() => {
    socket.on('roomJoined', ({ players, isLeader }) => {
      setPlayers(players);
      setIsLeader(isLeader);
      setRoomJoined(true);
      setRoomError('');
    });

    socket.on('roomError', ({ message }) => {
      setRoomError(message);
    });

    socket.on('updatePlayers', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('startGame', ({ words, timer }) => {
      setWords(words);
      setTimer(timer);
      setGameStarted(true);
    });

    socket.on('updateWords', ({ newWords, scores }) => {
      setWords(newWords);
      const playerScore = scores[socket.id]?.score || 0;
      setScore(playerScore);
    });

    socket.on('gameOver', ({ winners, scores, speeds }) => {
      const results = Object.keys(scores).map((id) => ({
        name: scores[id].name,
        score: scores[id].score,
        speed: speeds[id],
        id: id
      }));
      results.sort((a, b) => b.score - a.score);
      setRankings(results);
      setShowResults(true);
      setGameStarted(false);
    });

    return () => {
      socket.off('roomJoined');
      socket.off('roomError');
      socket.off('updatePlayers');
      socket.off('startGame');
      socket.off('updateWords');
      socket.off('gameOver');
    };
  }, []);

  useEffect(() => {
    if (gameStarted && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    }
    if (timer === 0 && gameStarted) {
      socket.emit('endGame', { room });
    }
  }, [gameStarted, timer, room]);

  const handleJoinRoom = () => {
    if (room.trim() && playerName.trim()) {
      socket.emit('joinRoom', { room, name: playerName });
    } else {
      setRoomError('Please enter both room name and your name');
    }
  };

  const handleStartGame = () => {
    if (players.length > 1) {
      socket.emit('startGame', { room, duration: selectedTime });
    } else {
      setRoomError('Need at least 2 players to start a game');
      setTimeout(() => setRoomError(''), 3000);
    }
  };

  const handleInput = (e) => {
    const input = e.target.value;
    setTypedWord(input);

    const matchedWord = words.find((w) => w.word === input.trim());
    if (matchedWord) {
      socket.emit('wordTyped', { room, word: input.trim(), timeTaken: 1 }); // Replace with actual time taken
      e.target.value = '';
      setTypedWord('');
    }
  };

  const resetGame = () => {
    setRoomJoined(false);
    setRoom('');
    setPlayerName('');
    setPlayers([]);
    setWords([]);
    setScore(0);
    setTypedWord('');
    setIsLeader(false);
    setGameStarted(false);
    setTimer(0);
    setShowResults(false);
  };

  const leaveRoom = () => {
    socket.emit('leaveRoom', { room });
    resetGame();
  };

  const getWordColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-gradient-to-r from-green-400 to-green-600 border-2 border-green-300';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-2 border-yellow-300';
      case 'hard':
        return 'bg-gradient-to-r from-red-400 to-red-600 border-2 border-red-300';
      case 'special':
        return 'bg-gradient-to-r from-blue-400 to-purple-600 border-2 border-blue-300 animate-pulse';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 border-2 border-gray-300';
    }
  };

  const getPlayerRankClass = (index) => {
    switch (index) {
      case 0: return 'border-l-4 border-yellow-400 bg-yellow-400 bg-opacity-10';
      case 1: return 'border-l-4 border-gray-400 bg-gray-400 bg-opacity-10';
      case 2: return 'border-l-4 border-amber-700 bg-amber-700 bg-opacity-10';
      default: return 'border-l-4 border-slate-600';
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 bg-center bg-cover w-full max-w-4xl mx-auto text-white p-8 rounded-xl shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <FaKeyboard className="absolute text-blue-500" style={{ top: '10%', left: '10%', fontSize: '4rem' }} />
        <FaKeyboard className="absolute text-green-500" style={{ top: '30%', right: '15%', fontSize: '3rem' }} />
        <FaKeyboard className="absolute text-purple-500" style={{ bottom: '20%', left: '20%', fontSize: '5rem' }} />
        <FaKeyboard className="absolute text-yellow-500" style={{ bottom: '10%', right: '10%', fontSize: '4rem' }} />
      </div>

      <h2 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        TypeRush Multiplayer
      </h2>

      {!roomJoined && !gameStarted && !showResults ? (
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-xl shadow-xl border-2 border-slate-700">
          <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Join or Create a Room</h3>
          
          {roomError && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
              {roomError}
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-300 mb-2">Room Name</label>
              <input
                type="text"
                placeholder="Enter a unique room name"
                className="px-4 py-3 w-full rounded-lg text-white bg-slate-700 border-2 border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Enter your display name"
                className="px-4 py-3 w-full rounded-lg text-white bg-slate-700 border-2 border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              className="bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-3 rounded-lg flex items-center justify-center gap-3 text-white hover:from-purple-600 hover:to-purple-800 transition duration-200 shadow-lg"
              onClick={handleJoinRoom}
            >
              <FaUsers size={20} /> Join Room
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-3 text-white hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-lg"
                onClick={() => navigate('/')}
              >
                <FaKeyboard size={20} /> Solo Mode
              </button>
              
              <button
                className="bg-gradient-to-r from-yellow-500 to-amber-700 px-6 py-3 rounded-lg flex items-center justify-center gap-3 text-white hover:from-yellow-600 hover:to-amber-800 transition duration-200 shadow-lg"
                onClick={() => navigate('/challenges')}
              >
                <FaTrophy size={20} /> Challenges
              </button>
            </div>
          </div>
        </div>
      ) : roomJoined && !gameStarted && !showResults ? (
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-xl shadow-xl border-2 border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              Room: {room}
            </h3>
            <button
              onClick={leaveRoom}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
            >
              Leave Room
            </button>
          </div>
          
          <div className="mb-8">
            <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaUsers className="text-purple-400" /> Players ({players.length})
            </h4>
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              {players.map((player, index) => (
                <div key={player.id} className={`flex items-center justify-between p-4 ${index !== players.length - 1 ? 'border-b border-slate-700' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-sm">#{index + 1}</span>
                    <span className="font-medium">{player.name}</span>
                    {player.isLeader && (
                      <FaCrown className="text-yellow-400 ml-2" title="Room Leader" />
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.id === socket.id ? '(You)' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {isLeader ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaClock className="text-blue-400" /> Game Duration
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {[30, 60, 90, 120].map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg text-white font-medium transition-all ${
                        selectedTime === time 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-700 scale-105 shadow-lg' 
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      {time === 60 ? '1 min' : time === 120 ? '2 min' : time === 90 ? '1.5 min' : `${time} sec`}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-4 rounded-lg flex items-center justify-center gap-3 text-white hover:from-green-600 hover:to-green-800 transition duration-200 shadow-lg text-lg font-medium w-full"
                onClick={handleStartGame}
              >
                <FaPlay size={20} /> Start Game ({players.length} Players)
              </button>
              
              <p className="text-center text-gray-400 text-sm">
                {players.length < 2 ? "You need at least one more player to start the game" : "All players are ready!"}
              </p>
            </div>
          ) : (
            <div className="text-center p-8 bg-slate-800 rounded-lg border border-slate-700">
              <FaClock className="text-blue-400 text-4xl mx-auto mb-4 animate-pulse" />
              <h4 className="text-xl font-semibold mb-2">Waiting for the room leader to start the game...</h4>
              <p className="text-gray-400">The game will begin automatically when the leader starts it.</p>
            </div>
          )}
        </div>
      ) : gameStarted ? (
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-between mb-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 rounded-lg shadow-lg border-2 border-slate-600">
            <div className="flex items-center gap-2 text-lg font-semibold bg-slate-700 px-4 py-2 rounded-lg">
              <FaClock size={20} className="text-cyan-400 animate-spin-slow" />
              <span className="text-xl font-mono">{timer}s</span>
            </div>

            <div className="flex items-center gap-2 text-lg font-semibold bg-slate-700 px-4 py-2 rounded-lg">
              <FaChartLine size={20} className="text-yellow-400" />
              <span className="text-xl font-mono">{score}</span>
            </div>
          </div>
          
          <div className="w-full mb-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 rounded-lg shadow-lg border-2 border-slate-600">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FaUsers className="text-purple-400" /> Live Rankings
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {players
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .map((player, index) => (
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between p-2 rounded ${getPlayerRankClass(index)} ${player.id === socket.id ? 'bg-purple-900 bg-opacity-20' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{index + 1}.</span>
                      <span>{player.name}</span>
                      {index === 0 && <FaTrophy className="text-yellow-400 ml-1" />}
                    </div>
                    <span className="font-mono">{player.score || 0}</span>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className="w-full mb-6 bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded-lg border-2 border-slate-700 shadow-inner">
            <h4 className="text-lg font-semibold mb-3">Type these words:</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {words.map((wordObj, idx) => (
                <span 
                  key={idx} 
                  className={`${getWordColor(wordObj.difficulty)} px-3 py-1 rounded-lg text-white font-medium`}
                >
                  {wordObj.word}
                </span>
              ))}
            </div>
          </div>
          
          <div className="w-full">
            <input
              type="text"
              value={typedWord}
              onChange={handleInput}
              className="px-4 py-3 w-full rounded-lg text-white bg-slate-700 border-2 border-slate-600 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Type the words as fast as you can..."
              autoFocus
            />
          </div>
        </div>
      ) : showResults && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-xl shadow-2xl border-2 border-slate-700"
          >
            <div className="text-center mb-8">
              <FaTrophy className="text-yellow-400 text-5xl mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                Game Results
              </h3>
              <p className="text-gray-300">Room: {room}</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {rankings.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg ${getPlayerRankClass(index)} ${player.id === socket.id ? 'bg-purple-900 bg-opacity-20' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">#{index + 1}</span>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">{player.name}</span>
                      <span className="text-sm text-gray-400">{player.id === socket.id ? '(You)' : ''}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-lg">{player.score} pts</span>
                    <span className="text-sm text-gray-400">{player.speed} WPM</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowResults(false);
                  setRoomJoined(true);
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-3 text-white hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-lg flex-1"
              >
                <FaRedo size={20} /> Play Again
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-3 rounded-lg flex items-center justify-center gap-3 text-white hover:from-green-600 hover:to-green-800 transition duration-200 shadow-lg flex-1"
              >
                <FaKeyboard size={20} /> Solo Mode
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MultiGame;