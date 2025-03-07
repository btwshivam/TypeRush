import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaHome, FaVolumeUp, FaVolumeMute, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import wordsData from '../data/wordsDatabase';

const ZenMode = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [typedWord, setTypedWord] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState([]);
  const [theme, setTheme] = useState('dark'); // dark or light
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState('easy');
  const inputRef = useRef(null);
  const audioRef = useRef(null);

  // Generate a list of random words
  const generateWords = (count = 10) => {
    const wordList = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * wordsData[difficulty].length);
      wordList.push(wordsData[difficulty][randomIndex]);
    }
    return wordList;
  };

  // Initialize words
  useEffect(() => {
    setWords(generateWords());
  }, [difficulty]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle typing
  const handleTyping = (e) => {
    const value = e.target.value;
    setTypedWord(value);
    
    // Check if word is completed (space pressed)
    if (value.endsWith(' ')) {
      const typedWordTrimmed = value.trim();
      const currentWord = words[currentWordIndex];
      
      // Add to completed words
      setCompletedWords([...completedWords, {
        word: currentWord,
        correct: typedWordTrimmed === currentWord
      }]);
      
      // Play sound if enabled
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      
      // Move to next word
      setCurrentWordIndex(currentWordIndex + 1);
      setTypedWord('');
      
      // Generate more words if needed
      if (currentWordIndex >= words.length - 3) {
        setWords([...words, ...generateWords(5)]);
      }
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Change difficulty
  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setWords(generateWords());
    setCurrentWordIndex(0);
    setCompletedWords([]);
    setTypedWord('');
  };

  // Get theme classes
  const getThemeClasses = () => {
    return theme === 'dark' 
      ? 'from-slate-900 to-slate-800 text-white' 
      : 'from-gray-100 to-white text-slate-800';
  };

  // Get input theme classes
  const getInputThemeClasses = () => {
    return theme === 'dark'
      ? 'bg-slate-700 text-white focus:ring-teal-500'
      : 'bg-white text-slate-800 border border-gray-300 focus:ring-teal-500';
  };

  // Get card theme classes
  const getCardThemeClasses = () => {
    return theme === 'dark'
      ? 'bg-slate-800'
      : 'bg-white shadow-md';
  };

  return (
    <div className={`bg-gradient-to-b ${getThemeClasses()} p-8 rounded-xl shadow-2xl max-w-4xl mx-auto transition-colors duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaLeaf className="text-teal-400" /> Zen Mode
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="bg-opacity-20 hover:bg-opacity-30 bg-slate-700 p-2 rounded-full transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
          <button
            onClick={toggleSound}
            className="bg-opacity-20 hover:bg-opacity-30 bg-slate-700 p-2 rounded-full transition-colors"
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <button
            onClick={() => navigate('/')}
            className={`${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}
          >
            <FaHome /> Home
          </button>
        </div>
      </div>

      <div className={`${getCardThemeClasses()} p-6 rounded-lg mb-6 transition-colors duration-300`}>
        <p className="text-center mb-4 opacity-70">
          Zen Mode is a relaxed, no-pressure typing practice. Just type at your own pace without timers or scores.
        </p>
        
        <div className="flex justify-center gap-3 mb-6">
          {['easy', 'medium', 'hard'].map(diff => (
            <button
              key={diff}
              onClick={() => changeDifficulty(diff)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                difficulty === diff
                  ? 'bg-teal-600 text-white'
                  : theme === 'dark' ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Words Display */}
        <div className="mb-6 text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {words.slice(currentWordIndex, currentWordIndex + 5).map((word, index) => (
              <span 
                key={`${word}-${currentWordIndex + index}`}
                className={`px-3 py-1 rounded-lg ${
                  index === 0 
                    ? 'bg-teal-600 bg-opacity-20 border border-teal-500' 
                    : theme === 'dark' ? 'bg-slate-700 bg-opacity-50' : 'bg-gray-200'
                }`}
              >
                {word}
              </span>
            ))}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={typedWord}
            onChange={handleTyping}
            className={`w-full max-w-md mx-auto px-4 py-3 rounded-lg text-lg ${getInputThemeClasses()} focus:outline-none focus:ring-2 transition-colors duration-300`}
            placeholder="Type here..."
            autoFocus
          />
        </div>
        
        {/* Completed Words */}
        {completedWords.length > 0 && (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700 bg-opacity-50' : 'bg-gray-100'} max-h-40 overflow-y-auto transition-colors duration-300`}>
            <div className="flex flex-wrap gap-2">
              {completedWords.map((item, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 rounded ${
                    item.correct 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}
                >
                  {item.word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Zen Tips */}
      <div className={`${getCardThemeClasses()} p-6 rounded-lg transition-colors duration-300`}>
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FaLeaf className="text-teal-400" /> Zen Typing Tips
        </h3>
        <ul className="space-y-2 opacity-80">
          <li>• Focus on accuracy rather than speed</li>
          <li>• Take deep breaths between words</li>
          <li>• Maintain good posture while typing</li>
          <li>• Take breaks if your hands feel tired</li>
          <li>• Enjoy the process without pressure</li>
        </ul>
      </div>
      
      {/* Audio for key sounds */}
      <audio ref={audioRef} src="/sounds/key-press.mp3" preload="auto"></audio>
    </div>
  );
};

export default ZenMode; 