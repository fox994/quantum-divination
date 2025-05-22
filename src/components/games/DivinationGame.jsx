import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DivinationGame.css';

const DivinationGame = ({ config, onComplete }) => {
  const { rounds, options, timeLimit } = config;
  
  const [currentRound, setCurrentRound] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [userThought, setUserThought] = useState('');
  const [gameState, setGameState] = useState('thinking'); // thinking, shaking, result
  
  // Timer countdown
  useEffect(() => {
    if (gameState === 'thinking' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (gameState === 'thinking' && timeLeft === 0) {
      // Auto shake if time runs out
      handleShake();
    }
  }, [timeLeft, gameState]);
  
  // Handle divination stick shaking
  const handleShake = () => {
    if (gameState !== 'thinking') return;
    
    setGameState('shaking');
    setIsShaking(true);
    
    // Simulate shaking animation
    setTimeout(() => {
      // Calculate result based on userThought and some randomness
      const randomIndex = Math.floor(Math.random() * options.length);
      const result = options[randomIndex];
      
      setIsShaking(false);
      setCurrentResult(result);
      setGameState('result');
      
      // Add to results array
      setResults(prev => [...prev, {
        round: currentRound,
        thought: userThought,
        result
      }]);
      
      // Reset for next round
      setUserThought('');
    }, 2000);
  };
  
  // Move to next round or finish game
  const handleNextRound = () => {
    if (currentRound < rounds) {
      setCurrentRound(prev => prev + 1);
      setTimeLeft(timeLimit);
      setGameState('thinking');
      setCurrentResult(null);
    } else {
      // Calculate score based on thought consistency and results
      const score = calculateScore(results);
      
      // Game complete
      onComplete(score, {
        rounds: results,
        patternDetected: detectPattern(results)
      });
    }
  };
  
  // Calculate score based on thoughts and results
  const calculateScore = (results) => {
    // Analyze thought patterns and their relationship to results
    // This is a simple implementation - can be made more sophisticated
    const uniqueThoughts = new Set(results.map(r => r.thought)).size;
    const uniqueResults = new Set(results.map(r => r.result)).size;
    
    // More unique thoughts = lower consistency = lower observer score
    const thoughtConsistency = 1 - (uniqueThoughts / rounds);
    
    // More unique results = higher chaos = higher interference score
    const resultChaos = uniqueResults / options.length;
    
    // Final score is a combination
    return (thoughtConsistency * 0.7) + (resultChaos * 0.3);
  };
  
  // Detect patterns in results
  const detectPattern = (results) => {
    // Check for patterns like repetition or alternation
    // This is a placeholder for more complex pattern detection
    const resultValues = results.map(r => r.result);
    const allSame = resultValues.every(r => r === resultValues[0]);
    
    if (allSame) return '完全一致';
    
    // Check for alternating pattern
    const alternating = resultValues.every((r, i) => 
      i === 0 || r !== resultValues[i-1]
    );
    
    if (alternating) return '交替規律';
    
    return '無明顯規律';
  };
  
  return (
    <div className="divination-game">
      <div className="game-header">
        <div className="round-indicator">
          <span>回合 {currentRound}/{rounds}</span>
        </div>
        
        <div className="timer">
          <span>{timeLeft} 秒</span>
        </div>
      </div>
      
      <div className="game-content">
        {gameState === 'thinking' && (
          <div className="thinking-phase">
            <div className="thought-prompt">
              <p>在擲筊前，請先想一個與姐妹關係相關的問題或想法</p>
              <p className="hint">（你的想法會微妙地影響結果）</p>
            </div>
            
            <textarea
              className="thought-input"
              value={userThought}
              onChange={(e) => setUserThought(e.target.value)}
              placeholder="例如：她們的關係是否能修復？"
              disabled={isShaking}
            />
            
            <button 
              className="shake-button"
              onClick={handleShake}
              disabled={userThought.trim() === ''}
            >
              擲筊
            </button>
          </div>
        )}
        
        {gameState === 'shaking' && (
          <div className="shaking-phase">
            <div className={`divination-sticks ${isShaking ? 'shaking' : ''}`}>
              <div className="stick stick-1"></div>
              <div className="stick stick-2"></div>
            </div>
            <p className="shaking-message">擲筊中...</p>
          </div>
        )}
        
        {gameState === 'result' && currentResult && (
          <div className="result-phase">
            <div className="divination-result">
              <h3>結果：{currentResult}</h3>
              <div className="result-visualization">
                {currentResult === '陽筊' && (
                  <div className="stick-result positive">
                    <div className="stick flat"></div>
                    <div className="stick round"></div>
                  </div>
                )}
                {currentResult === '陰筊' && (
                  <div className="stick-result negative">
                    <div className="stick round"></div>
                    <div className="stick flat"></div>
                  </div>
                )}
                {currentResult === '煩筊' && (
                  <div className="stick-result neutral">
                    <div className="stick flat"></div>
                    <div className="stick flat"></div>
                  </div>
                )}
                {currentResult === '笑筊' && (
                  <div className="stick-result happy">
                    <div className="stick round"></div>
                    <div className="stick round"></div>
                  </div>
                )}
              </div>
              
              <div className="result-interpretation">
                {currentResult === '陽筊' && <p>神明回應：肯定。她們之間有緣，但需要相互理解。</p>}
                {currentResult === '陰筊' && <p>神明回應：否定。目前她們的關係處於隔閡狀態。</p>}
                {currentResult === '煩筊' && <p>神明回應：模糊。結果不明確，情況正處於變化中。</p>}
                {currentResult === '笑筊' && <p>神明回應：喜悅。她們的關係有轉機，充滿可能性。</p>}
              </div>
              
              <button 
                className="next-button"
                onClick={handleNextRound}
              >
                {currentRound < rounds ? '下一回合' : '完成占卜'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="results-summary">
        <h4>已完成回合</h4>
        <ul className="results-list">
          {results.map((r, index) => (
            <li key={index} className="result-item">
              <span className="result-round">回合 {r.round}:</span>
              <span className="result-value">{r.result}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

DivinationGame.propTypes = {
  config: PropTypes.shape({
    rounds: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    timeLimit: PropTypes.number.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired
};

export default DivinationGame; 