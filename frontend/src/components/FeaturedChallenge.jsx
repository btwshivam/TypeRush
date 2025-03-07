import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCalendarAlt, FaKeyboard, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { challengeService } from '../services/api';

const FeaturedChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await challengeService.getCurrentChallenge();
        setChallenge(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load challenge');
        setLoading(false);
      }
    };

    fetchChallenge();
  }, []);

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

  const getThemeColors = (theme) => {
    const colors = {
      scifi: 'from-blue-500 to-purple-600',
      fantasy: 'from-purple-500 to-pink-600',
      programming: 'from-green-500 to-teal-600',
      medical: 'from-red-500 to-pink-600',
      legal: 'from-yellow-500 to-amber-600',
      christmas: 'from-red-500 to-green-600'
    };
    return colors[theme] || 'from-blue-500 to-indigo-600';
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const handleStartChallenge = () => {
    navigate('/challenge');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Featured Challenge
        </h2>
        <FaTrophy className="text-yellow-500 text-2xl" />
      </div>

      {challenge ? (
        <>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FaCalendarAlt />
              <span>Ends in {challenge.timeRemaining}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FaKeyboard />
              <span>Theme: {challenge.theme}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <FaStar />
              <span>Current High Score: {challenge.highScore} WPM</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartChallenge}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
            >
              Start Challenge
            </motion.button>
          </div>

          {challenge.leaderboard && challenge.leaderboard.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                Top Players
              </h3>
              <div className="space-y-2">
                {challenge.leaderboard.slice(0, 3).map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`
                        ${index === 0 ? 'text-yellow-500' : ''}
                        ${index === 1 ? 'text-gray-400' : ''}
                        ${index === 2 ? 'text-amber-600' : ''}
                      `}>
                        #{index + 1}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {entry.username}
                      </span>
                    </div>
                    <span className="font-mono text-gray-600 dark:text-gray-300">
                      {entry.score} WPM
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 dark:text-gray-300">
          No active challenge at the moment. Check back later!
        </p>
      )}
    </motion.div>
  );
};

export default FeaturedChallenge; 