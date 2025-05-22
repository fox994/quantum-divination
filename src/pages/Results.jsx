import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import './Results.css';

function Results() {
  const navigate = useNavigate();
  const { player, finalizeGame, resetGame } = useGame();
  
  const [ending, setEnding] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  
  // Calculate and display ending
  useEffect(() => {
    if (player.gameResults) {
      setEnding(player.gameResults);
    } else {
      const results = finalizeGame();
      setEnding(results);
    }
    
    // Animation timing
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 5000);
    
    const analysisTimer = setTimeout(() => {
      setShowAnalysis(true);
    }, 8000);
    
    return () => {
      clearTimeout(typingTimer);
      clearTimeout(analysisTimer);
    };
  }, [player.gameResults, finalizeGame]);
  
  // Start a new game
  const handleNewGame = () => {
    resetGame();
    navigate('/');
  };
  
  // Share results
  const handleShareResults = () => {
    const shareText = `我在《量子筊問》中獲得了「${ending?.title}」結局！我的量子心理傾向是「${getDominantTrait(ending?.details.trait)}」。`;
    
    if (navigator.share) {
      navigator.share({
        title: '量子筊問',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('結果已複製到剪貼板！'))
        .catch(err => console.error('分享失敗:', err));
    }
  };
  
  // Get trait name in Chinese
  const getDominantTrait = (trait) => {
    const traitNames = {
      observer: '觀測者',
      entanglement: '糾纏者',
      collapse: '塌縮者',
      interference: '干涉者',
      reflection: '反射者'
    };
    
    return traitNames[trait] || '未知';
  };
  
  // Get trait description
  const getTraitDescription = (trait) => {
    const descriptions = {
      observer: '你傾向於觀察而非參與，保持距離以看清全局。你相信觀測本身就能改變現實。',
      entanglement: '你深信人與人之間的聯繫，即使分離也能感知彼此。關係對你而言超越物理距離。',
      collapse: '你偏好確定性，喜歡將事物定義清楚。你的決定往往堅定而不易動搖。',
      interference: '你喜歡打破常規，創造新的可能性。你的存在常為他人帶來意想不到的改變。',
      reflection: '你善於自我反思，常在他人身上看到自己的影子。你將外界視為內在的映射。'
    };
    
    return descriptions[trait] || '';
  };
  
  if (!ending) {
    return <div className="loading">計算你的量子狀態中...</div>;
  }
  
  return (
    <div className="results-container">
      <div className={`ending-reveal ${isTyping ? 'typing' : 'revealed'}`}>
        <h1 className="ending-title">{ending.title}</h1>
        <p className="ending-description">{ending.description}</p>
        
        {ending.type === 'hidden' && (
          <div className="special-ending-note">
            <p>你解鎖了隱藏結局</p>
          </div>
        )}
      </div>
      
      {showAnalysis && (
        <div className="analysis-section">
          <h2>量子心理分析</h2>
          
          <div className="trait-analysis">
            <h3>主要傾向：{getDominantTrait(ending.details.trait)}</h3>
            <p className="trait-description">{getTraitDescription(ending.details.trait)}</p>
          </div>
          
          <div className="psyche-visualization">
            <h3>你的心理量子態</h3>
            <div className="quantum-bars">
              {Object.keys(player.psychProfile).map(trait => (
                <div key={trait} className="quantum-bar">
                  <div className="bar-label">{getDominantTrait(trait)}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ 
                        width: `${Math.abs(player.psychProfile[trait] * 10)}%`,
                        backgroundColor: player.psychProfile[trait] >= 0 ? '#4a8fe7' : '#e74a4a'
                      }}
                    ></div>
                  </div>
                  <div className="bar-value">{player.psychProfile[trait]}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="journey-summary">
            <h3>旅程總結</h3>
            <p>決定性選擇：{player.answers.length} 個</p>
            <p>一致性評分：{ending.details.consistency * 10}/10</p>
            <p>小遊戲表現：{Math.round(ending.details.gamePerformance * 100)}%</p>
          </div>
          
          <div className="philosophical-note">
            <p className="quantum-quote">
              {ending.type === 'collapse' && '"觀測使可能性坍縮為現實，但選擇觀測本身亦是一種可能性。"'}
              {ending.type === 'entanglement' && '"糾纏的粒子即使相隔宇宙兩端，也能瞬間感知彼此的狀態。"'}
              {ending.type === 'superposition' && '"在被觀測前，粒子同時存在於所有可能的狀態中。"'}
              {ending.type === 'reflection' && '"觀測者與被觀測者互為鏡像，你凝視的同時也被凝視著。"'}
              {ending.type === 'interference' && '"量子干涉使粒子的路徑互相抵消或加強，創造出全新的模式。"'}
              {ending.type === 'hidden' && '"若一切不曾被觀測，是否也不曾存在？"'}
            </p>
          </div>
        </div>
      )}
      
      <div className="action-buttons">
        <button className="new-game-button" onClick={handleNewGame}>
          開始新旅程
        </button>
        <button className="share-button" onClick={handleShareResults}>
          分享結果
        </button>
      </div>
    </div>
  );
}

export default Results; 