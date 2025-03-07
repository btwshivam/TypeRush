import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaFlag, FaClock, FaCar, FaRedo, FaHome, FaTrophy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import paragraphs from '../data/paragraphs';

const RaceMode = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [progress, setProgress] = useState(0);
  const [bestTime, setBestTime] = useState(
    parseInt(localStorage.getItem('raceModeBestTime')) || 0
  );
  const inputRef = useRef(null);

  // Get random paragraph
  const getParagraph = () => {
    const randomIndex = Math.floor(Math.random() * paragraphs.length);
    return paragraphs[randomIndex];
  };

  // Start race
  const startRace = () => {
    const paragraph = getParagraph();
    setText(paragraph.text);
    setTypedText('');
    setTime(0);
    setWpm(0);
    setAccuracy(100);
    setProgress(0);
    setIsPlaying(true);
    setGameOver(false);
    inputRef.current?.focus();
  };

  // Handle typing
  const handleTyping = (e) => {
    if (!isPlaying) return;
    
    const value = e.target.value;
    setTypedText(value);

    // Calculate progress
    const newProgress = (value.length / text.length) * 100;
    setProgress(newProgress);

    // Calculate accuracy
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) errors++;
    }
    const newAccuracy = Math.max(0, 100 - (errors / text.length * 100));
    setAccuracy(Math.round(newAccuracy));

    // Calculate WPM
    const words = value.trim().split(/\s+/).length;
    const minutes = time / 60;
    if (minutes > 0) {
      setWpm(Math.round(words / minutes));
    }

    // Check if race is complete
    if (value === text) {
      setIsPlaying(false);
      setGameOver(true);
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('raceModeBestTime', time.toString());
      }
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaFlag className="text-yellow-500" />
            Race Mode
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
            <h2 className="text-2xl font-bold mb-4">Ready to Race?</h2>
            <p className="text-gray-400 mb-6">
              Type the entire paragraph as fast as you can with high accuracy!
            </p>
            <div className="mb-6">
              <p className="text-sm text-gray-400">Best Time</p>
              <p className="text-3xl font-bold text-yellow-400">
                {bestTime ? formatTime(bestTime) : '--:--'}
              </p>
            </div>
            <button
              onClick={startRace}
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-800"
            >
              Start Race
            </button>
          </div>
        ) : gameOver ? (
          <div className="text-center bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Race Complete!</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Time</p>
                <p className="text-2xl font-bold">{formatTime(time)}</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">WPM</p>
                <p className="text-2xl font-bold">{wpm}</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Accuracy</p>
                <p className="text-2xl font-bold">{accuracy}%</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Best Time</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {formatTime(bestTime)}
                </p>
              </div>
            </div>
            <button
              onClick={startRace}
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-800"
            >
              Race Again
            </button>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-400">Time</p>
                  <p className="text-xl font-bold">{formatTime(time)}</p>
                </div>
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-400">WPM</p>
                  <p className="text-xl font-bold">{wpm}</p>
                </div>
                <div className="bg-slate-700 px-4 py-2 rounded-lg">
                  <p className="text-sm text-gray-400">Accuracy</p>
                  <p className="text-xl font-bold">{accuracy}%</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute h-full bg-yellow-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Start</span>
                <span>Finish ({Math.round(progress)}%)</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-slate-700 p-4 rounded-lg mb-4 text-gray-300 leading-relaxed">
                {text.split('').map((char, index) => {
                  let color = 'text-gray-400';
                  if (index < typedText.length) {
                    color = typedText[index] === char ? 'text-green-400' : 'text-red-400';
                  }
                  return (
                    <span key={index} className={color}>
                      {char}
                    </span>
                  );
                })}
              </div>
              <textarea
                ref={inputRef}
                value={typedText}
                onChange={handleTyping}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                rows={4}
                placeholder="Start typing here..."
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceMode; 