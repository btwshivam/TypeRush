import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaCode, 
  FaQuoteRight, 
  FaLeaf, 
  FaHeartbeat, 
  FaFlag,
  FaTrophy,
  FaChartLine,
  FaKeyboard,
  FaUsers,
  FaCrown,
  FaStar,
  FaPlay
} from 'react-icons/fa';

const GameModeSelection = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);

  const gameModes = [
    {
      id: 'code',
      name: 'Code Mode',
      description: 'Master programming syntax typing with real code snippets',
      icon: FaCode,
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800',
      stats: {
        highScore: localStorage.getItem('codeModeHighScore') || '0',
        gamesPlayed: localStorage.getItem('codeModeGamesPlayed') || '0',
        avgWPM: localStorage.getItem('codeModeAvgWPM') || '0'
      },
      features: [
        'Multiple programming languages',
        'Syntax highlighting',
        'Real code samples',
        'Language-specific challenges'
      ]
    },
    {
      id: 'quote',
      name: 'Quote Mode',
      description: 'Type inspiring quotes from historical figures and literature',
      icon: FaQuoteRight,
      color: 'from-purple-500 to-purple-700',
      hoverColor: 'hover:from-purple-600 hover:to-purple-800',
      stats: {
        highScore: localStorage.getItem('quoteModeHighScore') || '0',
        gamesPlayed: localStorage.getItem('quoteModeGamesPlayed') || '0',
        avgWPM: localStorage.getItem('quoteModeAvgWPM') || '0'
      },
      features: [
        'Famous quotes collection',
        'Author information',
        'Various categories',
        'Daily featured quotes'
      ]
    },
    {
      id: 'zen',
      name: 'Zen Mode',
      description: 'Practice typing in a relaxed, pressure-free environment',
      icon: FaLeaf,
      color: 'from-teal-500 to-teal-700',
      hoverColor: 'hover:from-teal-600 hover:to-teal-800',
      stats: {
        highScore: localStorage.getItem('zenModeHighScore') || '0',
        gamesPlayed: localStorage.getItem('zenModeGamesPlayed') || '0',
        avgWPM: localStorage.getItem('zenModeAvgWPM') || '0'
      },
      features: [
        'No time pressure',
        'Calming environment',
        'Focus on accuracy',
        'Customizable themes'
      ]
    },
    {
      id: 'survival',
      name: 'Survival Mode',
      description: 'Test your endurance with increasing difficulty levels',
      icon: FaHeartbeat,
      color: 'from-red-500 to-red-700',
      hoverColor: 'hover:from-red-600 hover:to-red-800',
      stats: {
        highScore: localStorage.getItem('survivalModeHighScore') || '0',
        gamesPlayed: localStorage.getItem('survivalModeGamesPlayed') || '0',
        avgWPM: localStorage.getItem('survivalModeAvgWPM') || '0'
      },
      features: [
        'Progressive difficulty',
        'Limited lives system',
        'Power-ups',
        'Endless gameplay'
      ]
    },
    {
      id: 'race',
      name: 'Race Mode',
      description: 'Complete against time to type full paragraphs accurately',
      icon: FaFlag,
      color: 'from-yellow-500 to-amber-700',
      hoverColor: 'hover:from-yellow-600 hover:to-amber-800',
      stats: {
        highScore: localStorage.getItem('raceModeHighScore') || '0',
        gamesPlayed: localStorage.getItem('raceModeGamesPlayed') || '0',
        avgWPM: localStorage.getItem('raceModeAvgWPM') || '0'
      },
      features: [
        'Time-based challenges',
        'Progress tracking',
        'Various text lengths',
        'Speed achievements'
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Choose Your Game Mode
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-400"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Select a mode that matches your typing goals and preferences
          </motion.p>
        </div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item} className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
                <FaTrophy className="text-2xl text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Best Performance</h3>
                <p className="text-3xl font-bold text-yellow-400">
                  {Math.max(...gameModes.map(mode => parseInt(mode.stats.highScore)))} WPM
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                <FaChartLine className="text-2xl text-blue-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Games</h3>
                <p className="text-3xl font-bold text-blue-400">
                  {gameModes.reduce((acc, mode) => acc + parseInt(mode.stats.gamesPlayed), 0)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-slate-800 rounded-xl p-6 border-2 border-slate-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
                <FaCrown className="text-2xl text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Favorite Mode</h3>
                <p className="text-3xl font-bold text-purple-400">
                  {gameModes.reduce((prev, current) => 
                    parseInt(current.stats.gamesPlayed) > parseInt(prev.stats.gamesPlayed) ? current : prev
                  ).name.split(' ')[0]}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Game Modes Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <motion.div
                key={mode.id}
                variants={item}
                className="group relative"
                onHoverStart={() => setSelectedMode(mode.id)}
                onHoverEnd={() => setSelectedMode(null)}
              >
                <div className={`h-full bg-slate-800 rounded-xl p-6 border-2 border-slate-700 
                  transition-all duration-300 ${selectedMode === mode.id ? 'transform scale-105' : ''}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 bg-gradient-to-r ${mode.color} rounded-lg`}>
                      <Icon className="text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                      <p className="text-gray-400 text-sm">{mode.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-700 bg-opacity-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">High Score</p>
                      <p className="text-xl font-bold">{mode.stats.highScore}</p>
                    </div>
                    <div className="bg-slate-700 bg-opacity-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Games</p>
                      <p className="text-xl font-bold">{mode.stats.gamesPlayed}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {mode.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                        <FaStar className="text-xs text-yellow-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => navigate(`/play/${mode.id}`)}
                    className={`w-full bg-gradient-to-r ${mode.color} ${mode.hoverColor} 
                      px-6 py-3 rounded-lg flex items-center justify-center gap-3 
                      text-white transition duration-200 shadow-lg font-medium`}
                  >
                    <FaPlay className="text-sm" /> Play {mode.name}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Access Buttons */}
        <motion.div 
          className="flex justify-center gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
              px-6 py-3 rounded-lg flex items-center gap-3 text-white transition duration-200 shadow-lg"
          >
            <FaKeyboard /> Classic Mode
          </button>
          <button
            onClick={() => navigate('/multiplayer')}
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 
              px-6 py-3 rounded-lg flex items-center gap-3 text-white transition duration-200 shadow-lg"
          >
            <FaUsers /> Multiplayer
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default GameModeSelection; 