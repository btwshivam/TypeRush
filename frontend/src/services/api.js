import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add request interceptor for error handling
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const challengeService = {
  getCurrentChallenge: async () => {
    try {
      const response = await api.get('/api/challenges/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current challenge:', error);
      // Return a default challenge object instead of throwing
      return {
        id: '1',
        theme: 'programming',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        highScore: 100,
        timeRemaining: '7 days',
        leaderboard: [
          { username: 'DefaultUser1', score: 100 },
          { username: 'DefaultUser2', score: 90 },
          { username: 'DefaultUser3', score: 80 }
        ]
      };
    }
  },

  getChallengeWords: async (count = 50) => {
    try {
      const response = await api.get(`/api/challenges/words?count=${count}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching challenge words:', error);
      // Return fallback data
      return {
        theme: 'programming',
        words: [
          { word: 'function', difficulty: 'easy' },
          { word: 'variable', difficulty: 'easy' },
          { word: 'array', difficulty: 'easy' },
          { word: 'object', difficulty: 'easy' },
          { word: 'class', difficulty: 'medium' },
          { word: 'promise', difficulty: 'medium' },
          { word: 'async', difficulty: 'medium' },
          { word: 'await', difficulty: 'medium' },
          { word: 'polymorphism', difficulty: 'hard' },
          { word: 'inheritance', difficulty: 'hard' },
          { word: 'javascript', difficulty: 'special' },
          { word: 'typescript', difficulty: 'special' }
        ]
      };
    }
  },

  submitChallengeScore: async (score, words, accuracy, username) => {
    try {
      const response = await api.post('/api/challenges/submit', {
        score,
        words,
        accuracy,
        username
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting challenge score:', error);
      throw error;
    }
  },

  getLeaderboard: async () => {
    try {
      const response = await api.get('/api/challenges/leaderboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }
};

export default api; 