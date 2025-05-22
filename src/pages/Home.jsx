import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import './Home.css';

function Home({ setPlayerId }) {
  const navigate = useNavigate();
  const { player, startNewGame, isConnectedToServer } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [startAnimationActive, setStartAnimationActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Start new game
  const handleStartGame = async () => {
    if (!playerName.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setStartAnimationActive(true);
    
    try {
      // Use the new startNewGame method from context
      const newPlayerId = await startNewGame(playerName);
      setPlayerId(newPlayerId);
      
      // Navigate to first chapter after short delay for animation
      setTimeout(() => {
        setIsLoading(false);
        navigate('/chapter/1');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setStartAnimationActive(false);
      setError('無法開始遊戲。請稍後再試。');
      console.error('Start game error:', error);
    }
  };
  
  // Continue game
  const handleContinueGame = () => {
    if (player.id) {
      navigate(`/chapter/${player.currentChapter}`);
    }
  };
  
  // Skip intro
  const handleSkipIntro = () => {
    setIsIntroVisible(false);
  };
  
  return (
    <div className={`home-container ${startAnimationActive ? 'fade-out' : ''}`}>
      {isIntroVisible ? (
        <div className="intro-screen">
          <h1 className="intro-title">量子筊問</h1>
          <div className="intro-content">
            <p className="intro-quote">「每一次擲筊，不是選擇命運，而是觀測你本就存在的多重狀態。」</p>
            
            <div className="intro-description">
              <p>在這趟旅程中，你將扮演一位擲筊師，幫助一對姐妹解開她們之間的糾纏。</p>
              <p>你的每個選擇都將影響故事走向，而你的心理傾向將決定最終結局。</p>
              <p>這不僅是一個故事，更是一次自我觀測的過程。</p>
            </div>
            
            <button 
              className="skip-intro-button"
              onClick={handleSkipIntro}
            >
              開始體驗
            </button>
          </div>
        </div>
      ) : (
        <div className="start-screen">
          <h1 className="game-title">量子筊問</h1>
          
          {isConnectedToServer && (
            <div className="server-status">
              <span className="status-online">伺服器已連接</span>
            </div>
          )}
          
          <div className="player-form">
            <div className="form-group">
              <label htmlFor="playerName">請輸入你的名字</label>
              <input 
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="觀測者之名..."
                maxLength={20}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-actions">
              <button 
                className="start-button"
                onClick={handleStartGame}
                disabled={!playerName.trim() || isLoading}
              >
                {isLoading ? '正在創建...' : '開始新旅程'}
              </button>
              
              {player.id && (
                <button 
                  className="continue-button"
                  onClick={handleContinueGame}
                  disabled={isLoading}
                >
                  繼續旅程 (第 {player.currentChapter} 章)
                </button>
              )}
            </div>
          </div>
          
          <div className="game-description">
            <h2>關於《量子筊問》</h2>
            <p>結合量子力學概念與中國傳統文化的互動敘事體驗。</p>
            <p>探索觀測、疊加、糾纏與命運的關係。</p>
            <p>每個選擇都將影響多重結局，揭露你內心的量子狀態。</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home; 