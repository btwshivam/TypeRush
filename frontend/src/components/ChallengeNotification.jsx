import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaTimes } from 'react-icons/fa';

const ChallengeNotification = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState('');

  useEffect(() => {
    // Check if we should show a notification about a new challenge
    const lastNotification = localStorage.getItem('lastChallengeNotification');
    const currentChallenge = localStorage.getItem('currentChallengeTheme');
    
    if (!lastNotification || lastNotification !== currentChallenge) {
      // Show notification for new challenge
      setTheme(currentChallenge || 'weekly');
      setShow(true);
      
      // Store that we've shown this notification
      if (currentChallenge) {
        localStorage.setItem('lastChallengeNotification', currentChallenge);
      }
    }
  }, []);

  if (!show) return null;

  const getThemeDisplayName = (theme) => {
    const names = {
      scifi: 'Science Fiction',
      fantasy: 'Fantasy & Magic',
      programming: 'Programming & Tech',
      medical: 'Medical Terminology',
      legal: 'Legal Language',
      christmas: 'Christmas Holiday',
      weekly: 'Weekly'
    };
    return names[theme] || theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg shadow-2xl border-2 border-slate-700 overflow-hidden z-50 animate-slide-up">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-2 rounded-full">
              <FaTrophy className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">New Challenge Available!</h3>
              <p className="text-gray-300">
                {getThemeDisplayName(theme)} challenge is now live. Compete for top rankings!
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShow(false)}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              navigate('/challenges');
              setShow(false);
            }}
            className="bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 rounded text-white font-medium hover:from-yellow-600 hover:to-amber-700 transition-colors"
          >
            View Challenge
          </button>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-yellow-500 to-amber-600 w-full animate-shrink" />
    </div>
  );
};

export default ChallengeNotification; 