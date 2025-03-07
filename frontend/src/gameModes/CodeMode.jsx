import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaClock, FaChartLine, FaRedo, FaHome, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import codeSnippets from '../data/codeSnippets';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-markup'; // HTML

const CodeMode = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('javascript');
  const [snippet, setSnippet] = useState(null);
  const [typedCode, setTypedCode] = useState('');
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [highlightedCode, setHighlightedCode] = useState('');
  const textareaRef = useRef(null);

  // Available languages
  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'sql', name: 'SQL' }
  ];

  // Get a random snippet for the selected language
  const getRandomSnippet = () => {
    const snippetsForLanguage = codeSnippets[language];
    return snippetsForLanguage[Math.floor(Math.random() * snippetsForLanguage.length)];
  };

  // Start a new game
  const startGame = () => {
    const newSnippet = getRandomSnippet();
    setSnippet(newSnippet);
    setTypedCode('');
    setTime(0);
    setIsPlaying(true);
    setGameOver(false);
    setAccuracy(100);
    setWpm(0);
    setErrors(0);
    setStartTime(Date.now());
    
    // Highlight the code
    const highlighted = Prism.highlight(
      newSnippet.code,
      Prism.languages[language === 'html' ? 'markup' : language],
      language === 'html' ? 'markup' : language
    );
    setHighlightedCode(highlighted);
    
    // Focus the textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    if (isPlaying) {
      setIsPlaying(false);
      setGameOver(false);
    }
  };

  // Handle typing
  const handleTyping = (e) => {
    if (!isPlaying) return;
    
    const value = e.target.value;
    setTypedCode(value);
    
    // Calculate accuracy
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== snippet.code[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    
    const accuracyValue = Math.max(0, 100 - (errorCount / snippet.code.length * 100));
    setAccuracy(Math.round(accuracyValue));
    
    // Check if completed
    if (value === snippet.code) {
      setIsPlaying(false);
      setGameOver(true);
      
      // Calculate final stats
      const endTime = Date.now();
      const timeInMinutes = (endTime - startTime) / 60000;
      const words = snippet.code.split(/\s+/).length;
      const calculatedWpm = Math.round(words / timeInMinutes);
      setWpm(calculatedWpm);
    }
  };

  // Timer
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        
        // Calculate WPM in real-time
        const timeInMinutes = (Date.now() - startTime) / 60000;
        if (timeInMinutes > 0) {
          const words = typedCode.split(/\s+/).length;
          const calculatedWpm = Math.round(words / timeInMinutes);
          setWpm(calculatedWpm);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, startTime, typedCode]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaCode className="text-green-400" /> Code Mode
        </h2>
        <button
          onClick={() => navigate('/')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaHome /> Home
        </button>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Select Language:</h3>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => handleLanguageChange(lang.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                language === lang.id
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Game Area */}
      {!isPlaying && !gameOver ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to improve your coding speed?</h3>
          <p className="text-gray-300 mb-6">
            Practice typing real code snippets in {languages.find(l => l.id === language)?.name}. 
            Improve your accuracy and speed while learning syntax.
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-3 rounded-lg text-white font-medium hover:from-green-600 hover:to-teal-700 transition-colors"
          >
            Start Typing
          </button>
        </div>
      ) : gameOver ? (
        <div className="bg-slate-800 p-8 rounded-lg">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              <FaCheck className="text-green-500 inline mr-2" /> Code Complete!
            </h3>
            <p className="text-gray-300">
              You've successfully typed the {snippet.name} snippet
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Time</p>
              <p className="text-2xl font-bold">{formatTime(time)}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">WPM</p>
              <p className="text-2xl font-bold">{wpm}</p>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-3 rounded-lg text-white font-medium hover:from-green-600 hover:to-teal-700 transition-colors flex items-center gap-2"
            >
              <FaRedo /> Try Another
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
            >
              <FaHome /> Home
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 p-6 rounded-lg">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-700 px-3 py-1 rounded-lg flex items-center gap-1">
                <FaClock className="text-blue-400" />
                <span>{formatTime(time)}</span>
              </div>
              <div className="bg-slate-700 px-3 py-1 rounded-lg flex items-center gap-1">
                <FaChartLine className="text-green-400" />
                <span>{wpm} WPM</span>
              </div>
              <div className="bg-slate-700 px-3 py-1 rounded-lg flex items-center gap-1">
                {accuracy >= 90 ? (
                  <FaCheck className="text-green-500" />
                ) : (
                  <FaTimes className="text-red-500" />
                )}
                <span>{accuracy}%</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {snippet.name} ({snippet.difficulty})
            </div>
          </div>
          
          {/* Code Display */}
          <div className="mb-4 bg-[#2d2d2d] p-4 rounded-lg overflow-x-auto">
            <pre className="text-sm">
              <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
          </div>
          
          {/* Typing Area */}
          <textarea
            ref={textareaRef}
            value={typedCode}
            onChange={handleTyping}
            className="w-full h-40 bg-slate-700 text-white p-4 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Start typing the code here..."
            spellCheck="false"
          />
        </div>
      )}
    </div>
  );
};

export default CodeMode; 