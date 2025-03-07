import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteRight, FaClock, FaChartLine, FaRedo, FaHome, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import quotes from '../data/quotes';

const QuoteMode = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [typedText, setTypedText] = useState('');
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [category, setCategory] = useState('all');
  const textareaRef = useRef(null);

  // Get unique categories
  const categories = ['all', ...new Set(quotes.map(q => q.category))];

  // Get a random quote
  const getRandomQuote = () => {
    const filteredQuotes = category === 'all' 
      ? quotes 
      : quotes.filter(q => q.category === category);
    return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
  };

  // Start a new game
  const startGame = () => {
    const newQuote = getRandomQuote();
    setQuote(newQuote);
    setTypedText('');
    setTime(0);
    setIsPlaying(true);
    setGameOver(false);
    setAccuracy(100);
    setWpm(0);
    setErrors(0);
    setStartTime(Date.now());
    
    // Focus the textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    if (isPlaying) {
      setIsPlaying(false);
      setGameOver(false);
    }
  };

  // Handle typing
  const handleTyping = (e) => {
    if (!isPlaying) return;
    
    const value = e.target.value;
    setTypedText(value);
    
    // Calculate accuracy
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== quote.text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    
    const accuracyValue = Math.max(0, 100 - (errorCount / quote.text.length * 100));
    setAccuracy(Math.round(accuracyValue));
    
    // Check if completed
    if (value === quote.text) {
      setIsPlaying(false);
      setGameOver(true);
      
      // Calculate final stats
      const endTime = Date.now();
      const timeInMinutes = (endTime - startTime) / 60000;
      const words = quote.text.split(/\s+/).length;
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
          const words = typedText.split(/\s+/).length;
          const calculatedWpm = Math.round(words / timeInMinutes);
          setWpm(calculatedWpm);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, startTime, typedText]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render character with highlighting for correct/incorrect
  const renderQuoteText = () => {
    if (!quote) return null;
    
    return quote.text.split('').map((char, index) => {
      let className = '';
      if (index < typedText.length) {
        className = typedText[index] === char ? 'text-green-400' : 'text-red-400 bg-red-900 bg-opacity-30';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8 rounded-xl shadow-2xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <FaQuoteRight className="text-blue-400" /> Quote Mode
        </h2>
        <button
          onClick={() => navigate('/')}
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaHome /> Home
        </button>
      </div>

      {/* Category Selection */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Select Category:</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Game Area */}
      {!isPlaying && !gameOver ? (
        <div className="bg-slate-800 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to type famous quotes?</h3>
          <p className="text-gray-300 mb-6">
            Practice typing inspirational and thought-provoking quotes from notable figures.
          </p>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-lg text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors"
          >
            Start Typing
          </button>
        </div>
      ) : gameOver ? (
        <div className="bg-slate-800 p-8 rounded-lg">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              <FaCheck className="text-green-500 inline mr-2" /> Quote Complete!
            </h3>
            <p className="text-gray-300">
              You've successfully typed the quote
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
          
          <div className="mb-6 bg-slate-700 p-4 rounded-lg">
            <p className="italic text-lg mb-2">"{quote.text}"</p>
            <p className="text-right text-gray-400">— {quote.author}</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-lg text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors flex items-center gap-2"
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
              {quote.category} ({quote.difficulty})
            </div>
          </div>
          
          {/* Quote Display */}
          <div className="mb-4 bg-slate-700 p-6 rounded-lg font-medium text-lg leading-relaxed">
            {renderQuoteText()}
          </div>
          
          {/* Author Display */}
          <div className="mb-4 text-right text-gray-400">
            — {quote.author}
          </div>
          
          {/* Typing Area */}
          <textarea
            ref={textareaRef}
            value={typedText}
            onChange={handleTyping}
            className="w-full h-24 bg-slate-700 text-white p-4 rounded-lg font-medium text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Start typing the quote here..."
            spellCheck="false"
          />
        </div>
      )}
    </div>
  );
};

export default QuoteMode; 