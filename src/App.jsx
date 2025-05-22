import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Home from './pages/Home';
import Chapter from './pages/Chapter';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

function App() {
  const [playerId, setPlayerId] = useState(localStorage.getItem('playerId') || null);
  
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Home setPlayerId={setPlayerId} />} />
          <Route path="/chapter/:chapterId" element={
            playerId ? <Chapter /> : <Navigate to="/" replace />
          } />
          <Route path="/results" element={
            playerId ? <Results /> : <Navigate to="/" replace />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App; 