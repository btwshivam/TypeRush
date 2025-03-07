import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaClock, FaChartLine, FaPlay, FaRedo, FaTrophy, FaUsers, FaKeyboard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import wordsData from '../data/wordsDatabase';
import TypingHeading from '../components/TypingHeading';
import FeaturedChallenge from '../components/FeaturedChallenge';

// Helper Functions
function getNewWord(category) {
  return wordsData[category][Math.floor(Math.random() * wordsData[category].length)];
}

function calculateWPM(correctTypedWords, time) {
  return Math.round((correctTypedWords / (30 - time)) * 60) || 0;
}

function calculateAccuracy(totalTypedWords, correctTypedWords) {
  return totalTypedWords > 0 ? Math.round((correctTypedWords / totalTypedWords) * 100) : 100;
}

function getRank(score) {
  if (score >= 50) return "Legendary";
  if (score >= 30) return "Expert";
  if (score >= 15) return "Advanced";
  if (score >= 5) return "Beginner";
  return "Novice";
}

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
const GameHeader = ({ time, lives, score }) => (
  <div className="w-full flex justify-between mb-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 rounded-lg shadow-lg border-2 border-slate-600">
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
);

// GameOver Component for displaying final score and game results
const GameOver = ({ score, calculateWPM, calculateAccuracy, getRank, restartGame }) => (
  <div className="text-center bg-gradient-to-b from-slate-800 to-slate-900 text-white px-8 py-6 rounded-xl shadow-2xl flex flex-col items-center border-2 border-slate-700">
    <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600 mb-2">Game Over!</h3>
    
    <div className="w-full grid grid-cols-2 gap-4 mt-6">
      <div className="bg-slate-700 p-4 rounded-lg">
        <p className="text-lg text-gray-300">Final Score</p>
        <p className="text-3xl font-bold text-white">{score}</p>
      </div>
      
      <div className="bg-slate-700 p-4 rounded-lg">
        <p className="text-lg text-gray-300">WPM</p>
        <p className="text-3xl font-bold text-white">{calculateWPM()}</p>
      </div>
      
      <div className="bg-slate-700 p-4 rounded-lg">
        <p className="text-lg text-gray-300">Accuracy</p>
        <p className="text-3xl font-bold text-white">{calculateAccuracy()}%</p>
      </div>
      
      <div className="bg-slate-700 p-4 rounded-lg">
        <p className="text-lg text-gray-300">Rank</p>
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">{getRank()}</p>
      </div>
    </div>
    
    <div className="mt-8 flex gap-4">
      <button onClick={restartGame} className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg flex items-center gap-3 text-white hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-lg">
        <FaRedo size={20} /> Play Again
      </button>
      
      <button onClick={() => window.location.href='/multiplayer'} className="bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-3 rounded-lg flex items-center gap-3 text-white hover:from-purple-600 hover:to-purple-800 transition duration-200 shadow-lg">
        <FaUsers size={20} /> Challenge Friends
      </button>
    </div>
  </div>
);

// GameControls Component for displaying game control buttons
const GameControls = ({ startGame, navigate }) => {
  const [selectedTime, setSelectedTime] = useState(30);
  
  return (
    <div className="text-center flex flex-col items-center bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-xl shadow-xl border-2 border-slate-700">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">TypeRush</h2>
        <p className="text-white text-lg">Race against time and friends!</p>
      </div>
      
      <div className="w-full max-w-md">
        <label className="block mb-4 text-lg text-white font-medium">Select Challenge Duration:</label>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[30, 60, 120].map(seconds => (
            <button 
              key={seconds}
              onClick={() => setSelectedTime(seconds)}
              className={`p-3 rounded-lg text-white font-medium transition-all ${
                selectedTime === seconds 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-700 scale-105 shadow-lg' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {seconds === 60 ? '1 minute' : seconds === 120 ? '2 minutes' : `${seconds} seconds`}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => startGame(selectedTime)} 
            className="bg-gradient-to-r from-green-500 to-green-700 px-6 py-4 rounded-lg flex items-center justify-center gap-3 text-white hover:from-green-600 hover:to-green-800 transition duration-200 shadow-lg text-lg font-medium"
          >
            <FaPlay size={20} /> Start Solo Challenge
          </button>
          
          <button 
            onClick={() => navigate('/multiplayer')} 
            className="bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-4 rounded-lg flex items-center justify-center gap-3 text-white hover:from-purple-600 hover:to-purple-800 transition duration-200 shadow-lg text-lg font-medium"
          >
            <FaUsers size={20} /> Multiplayer Mode
          </button>
          
          <button 
            onClick={() => navigate('/challenges')} 
            className="bg-gradient-to-r from-yellow-500 to-amber-700 px-6 py-4 rounded-lg flex items-center justify-center gap-3 text-white hover:from-yellow-600 hover:to-amber-800 transition duration-200 shadow-lg text-lg font-medium"
          >
            <FaTrophy size={20} /> Themed Challenges
          </button>
        </div>
      </div>
    </div>
  );
};

// Main SoloGame Component
const SoloGame = () => {
  const navigate = useNavigate();
  const wordSpeeds = { easy: 8, medium: 10, hard: 8, special: 9 };
  const lanes = ['easy', 'medium', 'hard', 'special'];

  const [words, setWords] = useState(
    lanes.reduce((acc, lane) => ({
      ...acc,
      [lane]: { text: getNewWord(lane), width: 100, key: Math.random() }
    }), {})
  );
  const [typedWord, setTypedWord] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [lives, setLives] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalTypedWords, setTotalTypedWords] = useState(0);
  const [correctTypedWords, setCorrectTypedWords] = useState(0);

  useEffect(() => {
    if (gameActive && time > 0 && lives > 0) {
      const timer = setInterval(() => setTime((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }

    if (time === 0 || lives === 0) {
      setGameActive(false);
      setGameOver(true);
    }
  }, [gameActive, time, lives]);

  function startGame(duration = 30) {
    setScore(0);
    setTypedWord('');
    setTime(duration);
    setLives(10);
    setGameActive(true);
    setGameOver(false);
    setTotalTypedWords(0);
    setCorrectTypedWords(0);
    
    // Ensure new words are generated
    setWords(() =>
      lanes.reduce((acc, lane) => ({
        ...acc,
        [lane]: { text: getNewWord(lane), width: 100, key: Math.random() }
      }), {})
    );
  }
  

  function handleInput(e) {
    const input = e.target.value.trim();
    setTypedWord(input);
    setTotalTypedWords((prev) => prev + 1);

    let foundCategory = lanes.find((lane) => words[lane].text === input);
    if (foundCategory) {
      handleCorrectWord(foundCategory);
      setCorrectTypedWords((prev) => prev + 1);
      e.target.value = '';
      setTypedWord('');
    }
  }

  function handleCorrectWord(category) {
    setScore((prev) => prev + (category === 'easy' ? 1 : category === 'medium' ? 3 : category === 'hard' ? 5 : 7));
    setWords((prev) => ({
      ...prev,
      [category]: { text: getNewWord(category), width: 100, key: Math.random() }
    }));
  }

  function handleWordMiss(category) {
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameActive(false);
        setGameOver(true);
      }
      return Math.max(0, newLives);
    });
    setWords((prev) => ({
      ...prev,
      [category]: { text: getNewWord(category), width: 100, key: Math.random() }
    }));
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 bg-center bg-cover w-full max-w-4xl mx-auto text-white p-8 rounded-xl shadow-2xl relative">
      {!gameActive && !gameOver && <FeaturedChallenge />}
      
      {!gameActive && !gameOver ? (
        <>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <FaKeyboard className="absolute text-blue-500" style={{ top: '10%', left: '10%', fontSize: '4rem' }} />
            <FaKeyboard className="absolute text-green-500" style={{ top: '30%', right: '15%', fontSize: '3rem' }} />
            <FaKeyboard className="absolute text-purple-500" style={{ bottom: '20%', left: '20%', fontSize: '5rem' }} />
            <FaKeyboard className="absolute text-yellow-500" style={{ bottom: '10%', right: '10%', fontSize: '4rem' }} />
          </div>
          <GameControls startGame={startGame} navigate={navigate} />
        </>
      ) : gameOver ? (
        <GameOver
          score={score}
          calculateWPM={() => calculateWPM(correctTypedWords, time)}
          calculateAccuracy={() => calculateAccuracy(totalTypedWords, correctTypedWords)}
          getRank={() => getRank(score)}
          restartGame={() => startGame(time)}
        />
      ) : (
        <div className='flex flex-col items-center'>
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            TypeRush Challenge
          </h2>
          <GameHeader time={time} lives={lives} score={score} />
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

export default SoloGame;
