// Sample challenge data
let currentChallenge = {
  id: '1',
  theme: 'Programming',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  highScore: 120,
  timeRemaining: '7 days',
  leaderboard: [
    { username: 'SpeedTyper', score: 120 },
    { username: 'CodeNinja', score: 115 },
    { username: 'TypeMaster', score: 110 }
  ]
};

// Word lists by theme and difficulty
const themedWords = {
  programming: {
    easy: ['function', 'variable', 'array', 'string', 'number', 'boolean', 'object', 'class', 'method'],
    medium: ['promise', 'async', 'await', 'callback', 'closure', 'prototype', 'inheritance'],
    hard: ['polymorphism', 'encapsulation', 'abstraction', 'asynchronous', 'recursion', 'memoization'],
    special: ['typescript', 'javascript', 'react', 'angular', 'vue', 'node', 'express']
  },
  scifi: {
    easy: ['robot', 'alien', 'space', 'laser', 'future', 'planet', 'star', 'moon', 'orbit'],
    medium: ['starship', 'teleport', 'wormhole', 'cyborg', 'android', 'quantum', 'galaxy'],
    hard: ['interstellar', 'extraterrestrial', 'nanotechnology', 'terraforming', 'cryogenics'],
    special: ['lightsaber', 'warpspeed', 'timetravel', 'holodeck', 'replicator', 'phaser']
  },
  fantasy: {
    easy: ['magic', 'dragon', 'sword', 'wizard', 'elf', 'dwarf', 'orc', 'spell', 'potion'],
    medium: ['enchanted', 'sorcery', 'mythical', 'legendary', 'kingdom', 'quest', 'artifact'],
    hard: ['incantation', 'necromancer', 'enchantment', 'conjuration', 'divination'],
    special: ['excalibur', 'mjolnir', 'valyrian', 'mithril', 'adamantium', 'vibranium']
  },
  medical: {
    easy: ['doctor', 'nurse', 'patient', 'hospital', 'clinic', 'health', 'medicine', 'therapy'],
    medium: ['diagnosis', 'treatment', 'symptom', 'prognosis', 'pathology', 'anatomy', 'physiology'],
    hard: ['oncology', 'neurology', 'cardiology', 'immunology', 'epidemiology', 'hematology'],
    special: ['stethoscope', 'defibrillator', 'electrocardiogram', 'anesthesia', 'laparoscopy']
  }
};

// Get current challenge
const getCurrentChallenge = (req, res) => {
  const now = new Date();
  const timeRemaining = Math.ceil((currentChallenge.endDate - now) / (1000 * 60 * 60 * 24));
  
  res.json({
    ...currentChallenge,
    timeRemaining: `${timeRemaining} days`
  });
};

// Submit challenge score
const submitChallengeScore = (req, res) => {
  const { score, words, accuracy, username } = req.body;
  
  // Update leaderboard if score is high enough
  if (score > 0) {
    const userIndex = currentChallenge.leaderboard.findIndex(entry => entry.username === username);
    
    if (userIndex !== -1) {
      // Update existing user's score if higher
      if (score > currentChallenge.leaderboard[userIndex].score) {
        currentChallenge.leaderboard[userIndex].score = score;
      }
    } else {
      // Add new user to leaderboard
      currentChallenge.leaderboard.push({
        username: username || 'Anonymous',
        score
      });
    }
    
    // Sort leaderboard by score in descending order
    currentChallenge.leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10 scores
    currentChallenge.leaderboard = currentChallenge.leaderboard.slice(0, 10);
    
    // Update high score if necessary
    if (score > currentChallenge.highScore) {
      currentChallenge.highScore = score;
    }
  }
  
  res.json({ 
    success: true, 
    message: 'Score submitted successfully',
    leaderboard: currentChallenge.leaderboard
  });
};

// Get leaderboard
const getLeaderboard = (req, res) => {
  res.json(currentChallenge.leaderboard);
};

// Get challenge words
const getChallengeWords = (req, res) => {
  const { count = 50 } = req.query;
  
  // Get the current challenge theme
  const theme = currentChallenge.theme.toLowerCase();
  
  // Default to programming theme if the current theme doesn't exist
  const wordSet = themedWords[theme] || themedWords.programming;
  
  // Create a pool of words from all difficulties
  const wordPool = [
    ...wordSet.easy.map(word => ({ word, difficulty: 'easy' })),
    ...wordSet.medium.map(word => ({ word, difficulty: 'medium' })),
    ...wordSet.hard.map(word => ({ word, difficulty: 'hard' })),
    ...wordSet.special.map(word => ({ word, difficulty: 'special' }))
  ];
  
  // Shuffle the word pool
  const shuffled = [...wordPool].sort(() => 0.5 - Math.random());
  
  // Take the requested number of words
  const selectedWords = shuffled.slice(0, parseInt(count));
  
  res.json({
    theme: currentChallenge.theme,
    words: selectedWords
  });
};

module.exports = {
  getCurrentChallenge,
  submitChallengeScore,
  getLeaderboard,
  getChallengeWords
}; 