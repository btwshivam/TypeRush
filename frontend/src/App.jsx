import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameModeSelection from './components/GameModeSelection';
import { 
  CodeMode, 
  QuoteMode, 
  ZenMode, 
  SurvivalMode, 
  RaceMode 
} from './gameModes';
import SoloGame from './pages/SoloGame';
import MultiGame from './pages/MultiGame';
import Challenges from './pages/Challenges';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastNotification';
import { ThemeProvider } from './contexts/ThemeContext';
import A11yConfig from './components/A11yConfig';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <A11yConfig />
            <Router>
              <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <Routes>
                    {/* Original Game Modes */}
                    <Route path="/" element={<SoloGame />} />
                    <Route path="/multiplayer" element={<MultiGame />} />
                    <Route path="/challenges" element={<Challenges />} />

                    {/* New Specialized Game Modes */}
                    <Route path="/modes" element={<GameModeSelection />} />
                    <Route path="/play/code" element={<CodeMode />} />
                    <Route path="/play/quote" element={<QuoteMode />} />
                    <Route path="/play/zen" element={<ZenMode />} />
                    <Route path="/play/survival" element={<SurvivalMode />} />
                    <Route path="/play/race" element={<RaceMode />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
