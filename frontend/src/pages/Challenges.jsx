import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaCalendarAlt, FaKeyboard, FaChartLine, FaPlay, FaUsers, FaMedal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { challengeService } from '../services/api';

const Challenges = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [userId] = useState(localStorage.getItem('userId') || `user_${Math.random().toString(36).substr(2, 9)}`);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(!localStorage.getItem('username'));

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const data = await challengeService.getCurrentChallenge();
        console.log('Challenge data received:', data);
        setChallenge(data);
        setLeaderboard(data.leaderboard || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching challenge:', err);
        setError('Failed to load challenge. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
    
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', userId);
    }
  }, [userId]);

  useEffect(() => {
    if (challenge) {
      const updateTimeRemaining = () => {
        const now = new Date();
        const end = new Date(challenge.endDate);
        const diff = end - now;
        
        if (diff <= 0) {
          setTimeRemaining('Challenge ended');
          return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeRemaining(`${days}d ${hours}h ${minutes}m remaining`);
      };
      
      updateTimeRemaining();
      const timer = setInterval(updateTimeRemaining, 60000);
      
      return () => clearInterval(timer);
    }
  }, [challenge]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username);
      setShowUsernamePrompt(false);
    }
  };

  const startChallengeGame = async () => {
    if (!username) {
      setShowUsernamePrompt(true);
      return;
    }

    try {
      setLoading(true);
      const response = await challengeService.getChallengeWords();
      console.log('Challenge words received:', response);

      localStorage.setItem('challengeTheme', response.theme);
      localStorage.setItem('challengeWords', JSON.stringify(response.words));
      
      setLoading(false);
      navigate('/challenge-game');
    } catch (err) {
      console.error('Error starting challenge:', err);
      setError('Failed to start challenge. Please try again.');
      setLoading(false);
    }
  };

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
      scifi: {
        primary: 'from-blue-500 to-purple-600',
        secondary: 'bg-blue-500',
        accent: 'text-blue-400'
      },
      fantasy: {
        primary: 'from-purple-500 to-pink-600',
        secondary: 'bg-purple-500',
        accent: 'text-purple-400'
      },
      programming: {
        primary: 'from-green-500 to-teal-600',
        secondary: 'bg-green-500',
        accent: 'text-green-400'
      },
      medical: {
        primary: 'from-red-500 to-pink-600',
        secondary: 'bg-red-500',
        accent: 'text-red-400'
      },
      legal: {
        primary: 'from-yellow-500 to-amber-600',
        secondary: 'bg-yellow-500',
        accent: 'text-yellow-400'
      },
      christmas: {
        primary: 'from-red-500 to-green-600',
        secondary: 'bg-red-500',
        accent: 'text-red-400'
      }
    };
    return colors[theme] || {
      primary: 'from-blue-500 to-indigo-600',
      secondary: 'bg-blue-500',
      accent: 'text-blue-400'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 bg-center bg-cover w-full max-w-4xl mx-auto text-white p-8 rounded-xl shadow-2xl relative">
      {showUsernamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Enter Your Username</h3>
            <p className="text-gray-300 mb-6">To participate in challenges and appear on leaderboards, please enter a username:</p>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-4 py-3 w-full rounded-lg text-white bg-slate-700 border-2 border-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all mb-4"
                placeholder="Your display name"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-3 text-white hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-lg w-full"
              >
                Save Username
              </button>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        TypeRush Challenges
      </h2>

      {error ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center">
          <FaCalendarAlt className="text-blue-400 text-5xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">No Active Challenge</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-3 text-white hover:from-blue-600 hover:to-blue-800 transition duration-200 shadow-lg mx-auto"
          >
            <FaKeyboard size={20} /> Back to Main Game
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className={`bg-gradient-to-r ${getThemeColors(challenge.theme).primary} p-6 rounded-xl shadow-lg border-2 border-slate-700`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">{getThemeDisplayName(challenge.theme)} Challenge</h3>
              <div className="bg-black bg-opacity-30 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <FaCalendarAlt /> {timeRemaining}
              </div>
            </div>
            <p className="text-white text-opacity-90 mb-6">
              Test your typing skills with {getThemeDisplayName(challenge.theme)} themed words! 
              Complete the challenge to earn your place on the leaderboard.
            </p>
            <button
              onClick={startChallengeGame}
              className="bg-white text-slate-900 px-6 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition duration-200 shadow-lg font-medium"
            >
              <FaPlay size={20} /> Start Challenge
            </button>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-slate-700">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaTrophy className={getThemeColors(challenge.theme).accent} /> Challenge Leaderboard
            </h3>
            
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FaUsers className="text-4xl mx-auto mb-3 opacity-50" />
                <p>No participants yet. Be the first to complete this challenge!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <motion.div
                    key={player.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 ? 'bg-yellow-500 bg-opacity-20 border-l-4 border-yellow-500' :
                      index === 1 ? 'bg-gray-400 bg-opacity-20 border-l-4 border-gray-400' :
                      index === 2 ? 'bg-amber-700 bg-opacity-20 border-l-4 border-amber-700' :
                      'bg-slate-700 bg-opacity-40'
                    } ${player.userId === userId ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 text-center font-bold">
                        {index === 0 ? <FaMedal key="gold" className="text-yellow-400 text-xl mx-auto" /> :
                         index === 1 ? <FaMedal key="silver" className="text-gray-400 text-xl mx-auto" /> :
                         index === 2 ? <FaMedal key="bronze" className="text-amber-700 text-xl mx-auto" /> : 
                         `#${index + 1}`}
                      </div>
                      <span className="font-medium">{player.username}</span>
                      {player.userId === userId && <span className="text-xs bg-blue-500 bg-opacity-30 px-2 py-1 rounded">You</span>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{player.highScore}</div>
                        <div className="text-xs text-gray-400">points</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{player.bestWpm}</div>
                        <div className="text-xs text-gray-400">WPM</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-slate-700">
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <ul className="space-y-2 text-gray-300">
                <li key="how-1" className="flex items-start gap-2">
                  <div className="mt-1 text-green-400">•</div>
                  <div>Type themed words as fast as you can</div>
                </li>
                <li key="how-2" className="flex items-start gap-2">
                  <div className="mt-1 text-green-400">•</div>
                  <div>Your best score is saved on the leaderboard</div>
                </li>
                <li key="how-3" className="flex items-start gap-2">
                  <div className="mt-1 text-green-400">•</div>
                  <div>Challenge changes weekly with new themes</div>
                </li>
                <li key="how-4" className="flex items-start gap-2">
                  <div className="mt-1 text-green-400">•</div>
                  <div>Earn badges for top leaderboard positions</div>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg border-2 border-slate-700">
              <h3 className="text-xl font-bold mb-3">Upcoming Themes</h3>
              <ul className="space-y-2 text-gray-300">
                <li key="theme-1" className="flex items-start gap-2">
                  <div className="mt-1 text-purple-400">•</div>
                  <div>Fantasy & Magic</div>
                </li>
                <li key="theme-2" className="flex items-start gap-2">
                  <div className="mt-1 text-green-400">•</div>
                  <div>Programming & Tech</div>
                </li>
                <li key="theme-3" className="flex items-start gap-2">
                  <div className="mt-1 text-red-400">•</div>
                  <div>Medical Terminology</div>
                </li>
                <li key="theme-4" className="flex items-start gap-2">
                  <div className="mt-1 text-yellow-400">•</div>
                  <div>And more seasonal surprises!</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges; 