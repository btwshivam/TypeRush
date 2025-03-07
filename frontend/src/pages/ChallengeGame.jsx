import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaClock, FaChartLine, FaRedo, FaTrophy, FaUsers, FaKeyboard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { challengeService } from '../services/api';

// WordLane Component for each word lane
const WordLane = ({ lane, words, handleWordMiss, wordSpeeds }) => {
  const laneColors = {
    easy: 'bg-gradient-to-r from-green-400 to-green-600 border-2 border-green-300',
    medium: 'bg-gradient-to-r from-yellow-400 to-yellow-600 border-2 border-yellow-300',
    hard: 'bg-gradient-to-r from-red-400 to-red-600 border-2 border-red-300',
    special: 'bg-gradient-to-r from-blue-400 to-purple-600 border-2 border-blue-300 animate-pulse'
  };

  return (
    <motion.div
      key={words[lane].key}
      initial={{ x: '-100%' }}
      animate={{
        x: lane === 'easy' ? '750%' :
          lane === 'medium' ? '600%' :
            lane === 'hard' ? '450%' :
              lane === 'special' ? '250%' : '500%'
      }}
      transition={{
        duration: wordSpeeds[lane] * (words[lane].text.length / 5),
        ease: 'linear',
        onComplete: () => handleWordMiss(lane)
      }}
      className={`relative px-4 py-2 text-white rounded-lg shadow-lg self-start ${laneColors[lane]} font-medium tracking-wide`}
    >
      {words[lane].text}
    </motion.div>
  );
};

// GameHeader Component for displaying score, time, and lives
const GameHeader = ({ time, lives, score, theme }) => {
  const getThemeDisplayName = (theme) => {
    const names = {
      scifi: 'Science Fiction',
      fantasy: 'Fantasy & Magic',
      programming: 'Programming & Tech',
      medical: 'Medical Terminology',
      legal: 'Legal Language',
      christmas: 'Christmas Holiday'
    };
    return names[theme] || theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-6">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-4 py-2 rounded-lg shadow-lg border-2 border-slate-600">
        <h3 className="text-lg font-semibold text-center">
          {getThemeDisplayName(theme)} Challenge
        </h3>
      </div>
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 rounded-lg shadow-lg border-2 border-slate-600 flex justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold bg-slate-700 px-4 py-2 rounded-lg">
          <FaClock size={20} className="text-cyan-400 animate-spin-slow" />
          <span className="text-xl font-mono">{time}s</span>
        </div>

        <div className="flex items-center gap-2 text-lg font-semibold bg-slate-700 px-4 py-2 rounded-lg">
          <div className='animate-bounce'> 
            <FaHeart size={20} className="text-rose-500 animate-pulse" />
          </div>
          <span className="text-xl font-mono">{lives}</span>
        </div>

        <div className="flex items-center gap-2 text-lg font-semibold bg-slate-700 px-4 py-2 rounded-lg">
          <FaChartLine size={20} className="text-yellow-400" />
          <span className="text-xl font-mono">{score}</span>
        </div>
      </div>
    </div>
  );
};

// GameOver Component for displaying final score and game results
const GameOver = ({ score, calculateWPM, calculateAccuracy, getRank, restartGame, theme, submitScore }) => {
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();
  const rank = getRank();

  useEffect(() => {
    // Submit score when game over screen is shown
    submitScore(score, wpm, accuracy);
  }, []);

  return (
    <div className="text-center bg-gradient-to-b from-slate-800 to-slate-900 text-white px-8 py-6 rounded-xl shadow-2xl flex flex-col items-center border-2 border-slate-700">
      <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600 mb-2">Challenge Complete!</h3>
      
      <div className="w-full grid grid-cols-2 gap-4 mt-6">
        <div className="bg-slate-700 p-4 rounded-lg">
          <p className="text-lg text-gray-300">Final Score</p>
          <p className="text-3xl font-bold text-white">{score}</p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg">
          <p className="text-lg text-gray-300">WPM</p>
          <p className="text-3xl font-bold text-white">{wpm}</p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg">
          <p className="text-lg text-gray-300">Accuracy</p>
          <p className="text-3xl font-bold text-white">{accuracy}%</p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg">
          <p className="text-lg text-gray-300">Rank</p>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">{rank}</p>
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
        <button onClick={restartGame} className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg flex items-center gap-3 text-white hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-lg">
          <FaRedo size={20} /> Try Again
        </button>
        
        <button onClick={() => window.location.href='/challenges'} className="bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-3 rounded-lg flex items-center gap-3 text-white hover:from-purple-600 hover:to-purple-800 transition duration-200 shadow-lg">
          <FaTrophy size={20} /> View Leaderboard
        </button>
      </div>
    </div>
  );
};

// Main ChallengeGame Component
const ChallengeGame = () => {
  const navigate = useNavigate();
  const wordSpeeds = { easy: 8, medium: 10, hard: 8, special: 9 };
  const lanes = ['easy', 'medium', 'hard', 'special'];
  
  const [theme, setTheme] = useState('');
  const [challengeWords, setChallengeWords] = useState(null);
  const [words, setWords] = useState({});
  const [typedWord, setTypedWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [lives, setLives] = useState(5);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalTypedWords, setTotalTypedWords] = useState(0);
  const [correctTypedWords, setCorrectTypedWords] = useState(0);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  // Load challenge data
  useEffect(() => {
    console.log('Loading challenge data...');
    const storedTheme = localStorage.getItem('challengeTheme');
    const storedWords = localStorage.getItem('challengeWords');
    
    console.log('Stored theme:', storedTheme);
    console.log('Stored words available:', !!storedWords);
    
    if (!storedTheme || !storedWords) {
      console.error('Missing challenge data');
      navigate('/challenges');
      return;
    }
    
    setTheme(storedTheme);
    console.log('Theme set to:', storedTheme);
    
    try {
      const parsedWords = JSON.parse(storedWords);
      setChallengeWords(parsedWords);
      console.log('Challenge words set');
      
      // Initialize words
      const initialWords = {};
      lanes.forEach(lane => {
        initialWords[lane] = { 
          text: getNewWord(lane, parsedWords), 
          width: 100, 
          key: Math.random() 
        };
      });
      setWords(initialWords);
      console.log('Initial words set');
      
      // Start game automatically
      startGame();
    } catch (err) {
      console.error('Error parsing stored words:', err);
      navigate('/challenges');
    }
  }, []);

  // Game timer
  useEffect(() => {
    if (gameActive && time > 0 && lives > 0) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    
    if ((time === 0 || lives === 0) && gameActive) {
      setGameActive(false);
      setGameOver(true);
    }
  }, [gameActive, time, lives]);

  // Get a new word from the challenge words
  function getNewWord(category, wordsData = challengeWords) {
    if (!wordsData) {
      console.error('No challenge words available');
      return 'error';
    }
    
    const words = wordsData[category];
    if (!words || !Array.isArray(words) || words.length === 0) {
      console.error(`No words available for category: ${category}`);
      return 'error';
    }
    
    return words[Math.floor(Math.random() * words.length)];
  }

  function calculateWPM() {
    return Math.round((correctTypedWords / (60 - time)) * 60) || 0;
  }

  function calculateAccuracy() {
    return totalTypedWords > 0 ? Math.round((correctTypedWords / totalTypedWords) * 100) : 100;
  }

  function getRank(score) {
    if (score >= 50) return "Legendary";
    if (score >= 30) return "Expert";
    if (score >= 15) return "Advanced";
    if (score >= 5) return "Beginner";
    return "Novice";
  }

  function startGame() {
    setGameActive(true);
    setGameOver(false);
    setScore(0);
    setTime(60);
    setLives(5);
    setTotalTypedWords(0);
    setCorrectTypedWords(0);
    setTypedWord('');
    
    // Reset words
    const newWords = {};
    lanes.forEach(lane => {
      newWords[lane] = { 
        text: getNewWord(lane), 
        width: 100, 
        key: Math.random() 
      };
    });
    setWords(newWords);
  }

  function handleInput(e) {
    if (!gameActive) return;
    
    const input = e.target.value;
    setTypedWord(input);
    
    // Check if the typed word matches any of the words
    for (const lane of lanes) {
      if (input === words[lane].text) {
        handleCorrectWord(lane);
        setTypedWord('');
        e.target.value = '';
        break;
      }
    }
  }

  function handleCorrectWord(category) {
    // Update score based on word difficulty
    const pointValues = { easy: 1, medium: 2, hard: 3, special: 5 };
    const points = pointValues[category] || 1;
    
    setScore(prev => prev + points);
    setTotalTypedWords(prev => prev + 1);
    setCorrectTypedWords(prev => prev + 1);
    
    // Replace the typed word with a new one
    setWords(prev => ({
      ...prev,
      [category]: { text: getNewWord(category), width: 100, key: Math.random() }
    }));
  }

  function handleWordMiss(category) {
    if (!gameActive) return;
    
    setLives(prev => prev - 1);
    setTotalTypedWords(prev => prev + 1);
    
    // Replace the missed word with a new one
    setWords(prev => ({
      ...prev,
      [category]: { text: getNewWord(category), width: 100, key: Math.random() }
    }));
  }

  async function submitScore(score, wpm, accuracy) {
    try {
      const scoreData = {
        userId,
        username,
        score,
        wpm,
        accuracy
      };

      const response = await challengeService.submitChallengeScore(scoreData);
      console.log('Score submitted:', response);

      // Update local storage with new high score if applicable
      const currentHighScore = parseInt(localStorage.getItem('challengeHighScore')) || 0;
      if (score > currentHighScore) {
        localStorage.setItem('challengeHighScore', score.toString());
      }

      return response;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 bg-center bg-cover w-full max-w-4xl mx-auto text-white p-8 rounded-xl shadow-2xl relative">
      {gameOver ? (
        <GameOver
          score={score}
          calculateWPM={calculateWPM}
          calculateAccuracy={calculateAccuracy}
          getRank={getRank}
          restartGame={startGame}
          theme={theme}
          submitScore={submitScore}
        />
      ) : (
        <div className='flex flex-col items-center'>
          <GameHeader time={time} lives={lives} score={score} theme={theme} />
          <div className="h-72 flex w-full flex-col gap-4 items-center justify-center bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden border-2 border-slate-700 shadow-inner">
            {lanes.map((lane) => (
              <WordLane
                key={lane}
                lane={lane}
                words={words}
                handleWordMiss={handleWordMiss}
                wordSpeeds={wordSpeeds}
              />
            ))}
          </div>
          <div className="mt-6 text-lg w-full">
            <input
              type="text"
              value={typedWord}
              onChange={handleInput}
              className="px-4 py-3 w-full rounded-lg text-white bg-slate-700 border-2 border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Type the words as they appear..."
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeGame; 