import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaKeyboard, 
  FaUser, 
  FaCog, 
  FaGamepad, 
  FaUsers, 
  FaTrophy, 
  FaChartLine,
  FaBell,
  FaSignOutAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const { darkMode, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { path: '/', icon: FaKeyboard, label: 'Solo' },
    { path: '/multiplayer', icon: FaUsers, label: 'Multiplayer' },
    { path: '/challenges', icon: FaTrophy, label: 'Challenges' },
    { path: '/modes', icon: FaGamepad, label: 'Game Modes' },
  ];

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300';
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-sm' : 'bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaKeyboard className="text-3xl text-blue-500 group-hover:text-blue-400 transition-colors" />
            </motion.div>
            <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">
              TypeRush
            </span>
          </Link>

          {/* Navigation Links - Updated for better mobile handling */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 whitespace-nowrap
                    ${location.pathname === item.path 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Right Side Menu */}
          <div className="flex items-center gap-2">
            {/* Stats Button */}
            <button 
              onClick={() => navigate('/stats')}
              className="p-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              title="Your Statistics"
            >
              <FaChartLine className="text-xl" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                title="Notifications"
              >
                <div className="relative">
                  <FaBell className="text-xl" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{username}</span>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <FaUser className="text-lg" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <FaCog className="text-lg" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors"
                  >
                    <FaSignOutAlt className="text-lg" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showDropdown && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900 border-t border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 flex items-center gap-2 transition-all duration-200 
                    ${location.pathname === item.path 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  onClick={() => setShowDropdown(false)}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;