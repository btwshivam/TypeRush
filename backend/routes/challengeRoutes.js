const express = require('express');
const router = express.Router();
const { getCurrentChallenge, submitChallengeScore, getLeaderboard, getChallengeWords } = require('../controllers/challengeController');

// Mock data for demonstration
let currentChallenge = {
  id: '1',
  theme: 'Programming',
  startDate: new Date(),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  highScore: 120,
  leaderboard: [
    { username: 'SpeedTyper', score: 120 },
    { username: 'CodeNinja', score: 115 },
    { username: 'TypeMaster', score: 110 }
  ]
};

// Get current challenge
router.get('/current', getCurrentChallenge);

// Submit challenge score
router.post('/submit', submitChallengeScore);

// Get leaderboard
router.get('/leaderboard', getLeaderboard);

// Get challenge words
router.get('/words', getChallengeWords);

module.exports = router; 