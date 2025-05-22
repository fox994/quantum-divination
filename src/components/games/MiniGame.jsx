import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DivinationGame from './DivinationGame';
import DoubleSplitGame from './DoubleSplitGame';
import './MiniGame.css';

const MiniGame = ({ gameData, onComplete }) => {
  const [isIntroShown, setIsIntroShown] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  
  // Start game after intro
  const handleStartGame = () => {
    setIsIntroShown(false);
    setGameStarted(true);
  };
  
  // Handle game completion
  const handleGameComplete = (score, details) => {
    setGameCompleted(true);
    setGameResult({ score, details });
    
    // Short delay before calling the parent's onComplete
    setTimeout(() => {
      onComplete(gameData.id, score, details);
    }, 3000);
  };
  
  // Render appropriate game based on type
  const renderGame = () => {
    switch (gameData.type) {
      case 'divination':
        return (
          <DivinationGame 
            config={gameData.config}
            onComplete={handleGameComplete}
          />
        );
      case 'double_slit':
        return (
          <DoubleSplitGame
            config={gameData.config}
            onComplete={handleGameComplete}
          />
        );
      // Add more game types here
      default:
        return <div>未知遊戲類型</div>;
    }
  };
  
  // Game intro screen
  if (isIntroShown) {
    return (
      <div className="minigame-intro">
        <h2 className="minigame-title">{gameData.title}</h2>
        <p className="minigame-description">{gameData.description}</p>
        <button 
          className="start-game-button"
          onClick={handleStartGame}
        >
          開始遊戲
        </button>
      </div>
    );
  }
  
  // Game completion screen
  if (gameCompleted && gameResult) {
    return (
      <div className="minigame-completion">
        <h2 className="completion-title">遊戲完成</h2>
        <div className="result-display">
          <p className="result-score">你的表現: {Math.round(gameResult.score * 100)}%</p>
          <p className="result-message">
            {gameResult.score > 0.7 
              ? '你展現了強烈的量子觀測傾向。' 
              : gameResult.score > 0.4 
                ? '你處於疊加態，既是觀測者也是被觀測者。' 
                : '你似乎迴避了觀測，保持在不確定性中。'
            }
          </p>
        </div>
        <div className="completion-message">
          <p>正在記錄你的心理傾向...</p>
        </div>
      </div>
    );
  }
  
  // Active game screen
  return (
    <div className="minigame-container">
      <h2 className="minigame-title">{gameData.title}</h2>
      {gameStarted && renderGame()}
    </div>
  );
};

MiniGame.propTypes = {
  gameData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired
};

export default MiniGame; 