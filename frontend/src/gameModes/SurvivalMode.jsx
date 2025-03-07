import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaClock, FaChartLine, FaRedo, FaHome, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import wordsData from '../data/wordsDatabase';

const SurvivalMode = () => {
  const navigate = useNavigate();
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentWord, setCurrentWord] = useState('');
  const [typedWord, setTypedWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('survivalHighScore')) || 0
  );
  const inputRef = useRef(null);

  // Get word based on level
  const getWord = () => {
    const difficulty = level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard';
    const words = wordsData[difficulty];
    return words[Math.floor(Math.random() * words.length)];
  };

  // Start game
  const startGame = () => {
    setLives(3);
    setScore(0);
    setLevel(1);
    setTimeLeft(5);
    setIsPlaying(true);
    setGameOver(false);
    setCurrentWord(getWord());
    setTypedWord('');
    inputRef.current?.focus();
  };

  // Handle typing
  const handleTyping = (e) => {
    if (!isPlaying) return;
    
    const value = e.target.value;
    setTypedWord(value);

    // Check if word is correct
    if (value.toLowerCase() === currentWord.toLowerCase()) {
      // Add score based on level and time left
      const points = Math.ceil(level * (1 + timeLeft/10));
      setScore(prev => prev + points);
      
      // Level up every 5 words
      if (score > 0 && score % 50 === 0) {
        setLevel(prev => prev + 1);
      }
      
      // Reset for next word
      setTypedWord('');
      setCurrentWord(getWord());
      setTimeLeft(Math.max(5 - Math.floor(level/2), 2)); // Decrease time limit as level increases
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Lose a life when time runs out
            setLives(prevLives => {
              const newLives = prevLives - 1;
              if (newLives <= 0) {
                setGameOver(true);
                setIsPlaying(false);
                if (score > highScore) {
                  setHighScore(score);
                  localStorage.setItem('survivalHighScore', score.toString());
                }
              } else {
                // Reset for next word
                setCurrentWord(getWord());
                setTypedWord('');
                return newLives;
              }
              return newLives;
            });
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, level, score, highScore]);

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaHeartbeat className="text-red-500" />
            Survival Mode
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaHome /> Home
          </button>
        </div>

        {!isPlaying && !gameOver ? (
          <div className="text-center bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to Survive?</h2>
            <p className="text-gray-400 mb-6">
              Type words before time runs out. Each level gets harder!
            </p>
            <div className="mb-6">
              <p className="text-sm text-gray-400">High Score</p>
              <p className="text-3xl font-bold text-yellow-400">{highScore}</p>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800"
            >
              Start Game
            </button>
          </div>
        ) : gameOver ? (
          <div className="text-center bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Final Score</p>
                <p className="text-2xl font-bold">{score}</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Level Reached</p>
                <p className="text-2xl font-bold">{level}</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">High Score</p>
                <p className="text-2xl font-bold text-yellow-400">{highScore}</p>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2">
                {[...Array(lives)].map((_, i) => (
                  <FaHeart key={i} className="text-red-500 text-2xl" />
                ))}
              </div>
              <div className="flex gap-4">
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-400">Score</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-400">Level</p>
                  <p className="text-xl font-bold">{level}</p>
                </div>
              </div>
            </div>

            <motion.div
              className="mb-8"
              animate={{
                scale: timeLeft <= 2 ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: timeLeft <= 2 ? Infinity : 0,
              }}
            >
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute h-full bg-red-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 5) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-center text-gray-400">Time Left: {timeLeft}s</p>
            </motion.div>

            <div className="text-center mb-8">
              <p className="text-3xl font-bold mb-4">{currentWord}</p>
              <input
                ref={inputRef}
                type="text"
                value={typedWord}
                onChange={handleTyping}
                className="w-full max-w-md bg-slate-700 text-white px-4 py-3 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Type here..."
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurvivalMode; 