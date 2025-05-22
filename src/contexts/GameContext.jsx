import { createContext, useContext, useState, useEffect } from 'react';
import { calculateEnding } from '../utils/endingCalculator';
import { startGame, recordAnswer, getProgress } from '../utils/api';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState({
    id: localStorage.getItem('playerId') || null,
    name: localStorage.getItem('playerName') || '',
    currentChapter: parseInt(localStorage.getItem('currentChapter') || '1'),
    answers: JSON.parse(localStorage.getItem('playerAnswers') || '[]'),
    gameResults: JSON.parse(localStorage.getItem('gameResults') || 'null'),
    psychProfile: JSON.parse(localStorage.getItem('psychProfile') || JSON.stringify({
      observer: 0, // 觀測傾向
      entanglement: 0, // 糾纏傾向
      collapse: 0, // 塌縮傾向
      interference: 0, // 干涉傾向
      reflection: 0, // 反射傾向
    })),
    miniGameResults: JSON.parse(localStorage.getItem('miniGameResults') || '[]'),
  });
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isConnectedToServer, setIsConnectedToServer] = useState(false);

  // Check connection to server
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL || 'http://localhost:3000/api');
        setIsConnectedToServer(response.ok);
      } catch (error) {
        setIsConnectedToServer(false);
        console.log('Server connection failed:', error);
      }
    };
    
    if (isOnline) {
      checkServerConnection();
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (player.id) {
      localStorage.setItem('playerId', player.id);
      localStorage.setItem('playerName', player.name);
      localStorage.setItem('currentChapter', player.currentChapter.toString());
      localStorage.setItem('playerAnswers', JSON.stringify(player.answers));
      localStorage.setItem('gameResults', JSON.stringify(player.gameResults));
      localStorage.setItem('psychProfile', JSON.stringify(player.psychProfile));
      localStorage.setItem('miniGameResults', JSON.stringify(player.miniGameResults));
    }
  }, [player]);

  // Load progress from server when connected
  useEffect(() => {
    const loadProgress = async () => {
      if (player.id && isConnectedToServer) {
        try {
          const progress = await getProgress(player.id);
          setPlayer(prev => ({
            ...prev,
            name: progress.player.name,
            currentChapter: progress.player.currentChapter,
            psychProfile: progress.player.psychProfile,
            answers: progress.answers
          }));
        } catch (error) {
          console.error('Failed to load progress from server:', error);
        }
      }
    };
    
    if (isConnectedToServer) {
      loadProgress();
    }
  }, [player.id, isConnectedToServer]);

  // Start a new game with server
  const startNewGame = async (name) => {
    try {
      let playerId = null;
      let initialProfile = {
        observer: 0,
        entanglement: 0,
        collapse: 0,
        interference: 0,
        reflection: 0,
      };
      
      // If connected to server, create player on server
      if (isConnectedToServer) {
        const result = await startGame(name);
        playerId = result.playerId;
      } else {
        // Fallback to local storage only
        playerId = Date.now().toString();
      }
      
      setPlayer({
        id: playerId,
        name,
        currentChapter: 1,
        answers: [],
        gameResults: null,
        psychProfile: initialProfile,
        miniGameResults: []
      });
      
      return playerId;
    } catch (error) {
      console.error('Error starting new game:', error);
      throw error;
    }
  };

  // Record a player's answer
  const recordPlayerAnswer = async (chapterId, questionId, answerId, psychImpact) => {
    const newAnswer = { 
      chapterId, 
      questionId, 
      answerId, 
      timestamp: new Date().toISOString() 
    };
    
    // Update psychological profile based on answer
    const newPsychProfile = { ...player.psychProfile };
    Object.keys(psychImpact).forEach(key => {
      newPsychProfile[key] += psychImpact[key];
    });

    // Update local state first for immediate feedback
    setPlayer(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
      psychProfile: newPsychProfile
    }));
    
    // If connected to server, record answer on server
    if (isConnectedToServer) {
      try {
        await recordAnswer(player.id, chapterId, questionId, answerId, psychImpact);
      } catch (error) {
        console.error('Failed to record answer on server:', error);
      }
    }
  };

  // Record mini-game result
  const recordMiniGameResult = (chapterId, gameId, score, details) => {
    const gameResult = { chapterId, gameId, score, details, timestamp: new Date().toISOString() };
    
    setPlayer(prev => ({
      ...prev,
      miniGameResults: [...prev.miniGameResults, gameResult]
    }));
  };

  // Advance to next chapter
  const advanceChapter = () => {
    setPlayer(prev => ({
      ...prev,
      currentChapter: prev.currentChapter + 1
    }));
  };

  // Calculate and set final results
  const finalizeGame = () => {
    const ending = calculateEnding(player.answers, player.psychProfile, player.miniGameResults);
    
    setPlayer(prev => ({
      ...prev,
      gameResults: ending
    }));

    return ending;
  };

  // Reset game
  const resetGame = () => {
    localStorage.removeItem('playerId');
    localStorage.removeItem('playerName');
    localStorage.removeItem('currentChapter');
    localStorage.removeItem('playerAnswers');
    localStorage.removeItem('gameResults');
    localStorage.removeItem('psychProfile');
    localStorage.removeItem('miniGameResults');
    
    setPlayer({
      id: null,
      name: '',
      currentChapter: 1,
      answers: [],
      gameResults: null,
      psychProfile: {
        observer: 0,
        entanglement: 0, 
        collapse: 0,
        interference: 0,
        reflection: 0,
      },
      miniGameResults: []
    });
  };

  const value = {
    player,
    isOnline,
    isConnectedToServer,
    setPlayer,
    startNewGame,
    recordAnswer: recordPlayerAnswer,
    recordMiniGameResult,
    advanceChapter,
    finalizeGame,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}; 