import React from 'react';
import { FaTrophy, FaMedal, FaStar } from 'react-icons/fa';

const ChallengeBadge = ({ theme, rank, size = 'md' }) => {
  const getThemeIcon = (theme) => {
    const icons = {
      scifi: '🚀',
      fantasy: '🧙',
      programming: '💻',
      medical: '⚕️',
      legal: '⚖️',
      christmas: '🎄'
    };
    return icons[theme] || '🏆';
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

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaTrophy className="text-yellow-400" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-amber-700" />;
    return <FaStar className="text-blue-400" />;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${getThemeColors(theme)} flex items-center justify-center relative`}
      title={`${theme.charAt(0).toUpperCase() + theme.slice(1)} Challenge - Rank ${rank}`}
    >
      <span className="text-xl">{getThemeIcon(theme)}</span>
      {rank <= 3 && (
        <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-1">
          {getRankIcon(rank)}
        </div>
      )}
    </div>
  );
};

export default ChallengeBadge; 