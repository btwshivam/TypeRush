# TypeRush - Advanced Typing Practice Platform 🚀


[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/btwshivam/TypeRush/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-14.0%2B-brightgreen)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.17%2B-black?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.0%2B-blue)](https://reactjs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.5.1-black)](https://socket.io/)


## 📖 Overview

TypeRush is a modern, feature-rich typing practice platform built with React and Node.js. It offers multiple game modes, real-time multiplayer challenges, and themed typing exercises to help users improve their typing speed and accuracy through engaging, gamified experiences.

Whether you're a programmer looking to improve coding speed, a student wanting to type essays faster, or just someone who wants to enhance their typing skills, TypeRush provides a fun and effective way to practice.

## ✨ Key Features

### 🎮 Multiple Game Modes

- **Solo Mode**: Classic typing practice with progressive difficulty levels
- **Code Mode**: Programming-specific typing practice with syntax highlighting for various languages
- **Quote Mode**: Practice with famous quotes and literary passages from renowned authors
- **Zen Mode**: Relaxed, pressure-free typing environment with calming visuals and no time constraints
- **Survival Mode**: Challenging mode with limited lives and increasing difficulty over time
- **Race Mode**: Time-based challenges for speed improvement with dynamic difficulty adjustment

### 👥 Real-time Multiplayer System

- **Live Competitions**: Race against other players in real-time with instant feedback
- **Room Management**: Create private or public rooms with customizable settings
- **Live Leaderboards**: Real-time score tracking and rankings during gameplay
- **Chat System**: Communicate with other players before and after races
- **Performance Metrics**: Track WPM, accuracy, and rankings compared to opponents

### 🏆 Weekly Themed Challenges

- **Rotating Themes**: New challenges every week with unique word sets
- **Specialized Word Sets**: Theme-specific vocabulary including:
  - Programming terminology (JavaScript, Python, etc.)
  - Science fiction concepts and terminology
  - Medical and scientific terms
  - Legal language and terminology
  - Fantasy worlds and creatures
  - And many more rotating themes
- **Global Leaderboards**: Compete with players worldwide for top positions
- **Achievement System**: Earn badges, trophies, and rewards for completing challenges

### 📊 Advanced Statistics & Analytics

- **Detailed Performance Tracking**:
  - Words per minute (WPM) with historical trends
  - Accuracy percentage and error patterns
  - Problem keys and improvement suggestions
  - Progress visualization over time
- **Personal Best Records** for each game mode and challenge
- **Interactive Heatmaps & Charts** showing typing patterns
- **Achievement History** and progression tracking


![Screenshot (458)](https://github.com/user-attachments/assets/5b45c47c-2684-41a0-ab01-49485bcd3402)
![Screenshot (460)](https://github.com/user-attachments/assets/75c80db7-6d4b-4146-a697-abab0847681e)
![Screenshot (461)](https://github.com/user-attachments/assets/ea0e8b6a-d42b-4e25-933e-f92de5eeb785)
![Screenshot (462)](https://github.com/user-attachments/assets/b908e7d1-a8be-4ae9-84b8-9b13aa842f69)
![Screenshot (463)](https://github.com/user-attachments/assets/0342eae2-a9d0-452f-a0ad-c6b02ffbd2c4)
![Screenshot (464)](https://github.com/user-attachments/assets/61fdd14b-dda3-4e9e-aec6-aafee49f7f7a)
![Screenshot (465)](https://github.com/user-attachments/assets/3e31c8aa-aa76-40c6-af99-d0b5e9a02e70)



## 🛠️ Technical Stack

### Frontend
- **React.js** with Hooks and Context API for state management
- **Framer Motion** for smooth, responsive animations
- **Tailwind CSS** for modern, responsive styling
- **Socket.io-client** for real-time multiplayer features
- **Axios** for API communication
- **Vite** for fast development and optimized builds

### Backend
- **Node.js & Express** for robust server architecture
- **Socket.io** for real-time bidirectional communication
- **MongoDB** (optional) for data persistence and user profiles
- **JWT** for secure authentication
- **RESTful API** architecture for frontend-backend communication

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/btwshivam/typerush.git
   cd typerush
   ```

2. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env` file in the backend directory:
   ```
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the application**:
   ```bash
   # Start backend (from the backend directory)
   npm run dev

   # Start frontend (from the frontend directory)
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:5173`

## 🎮 Game Modes Explained

### Solo Mode
Practice typing at your own pace with customizable difficulty settings. Track your progress over time and set personal records.

### Multiplayer Mode
Join or create rooms to compete with friends or random players in real-time typing races. See live progress of all participants and chat with them before and after races.

### Challenge Mode
Participate in weekly themed challenges with specialized word sets. Compete on global leaderboards and earn achievements for your performance.

## 🧩 Word Categories and Themes

TypeRush categorizes words by difficulty and organizes them into themes:

### Difficulty Levels
- **Easy**: Common, shorter words (1-2 points)
- **Medium**: Intermediate complexity words (2-3 points)
- **Hard**: Challenging vocabulary (3-4 points)
- **Special**: Theme-specific terminology (5 points)

### Sample Themes
- **Programming**: JavaScript, Python, React, algorithms
- **Sci-Fi**: Space exploration, futuristic technology, alien species
- **Medical**: Anatomy, procedures, medications, diagnoses
- **Fantasy**: Magical creatures, spells, mythical locations
- **Legal**: Legal terms, procedures, and concepts


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) 
