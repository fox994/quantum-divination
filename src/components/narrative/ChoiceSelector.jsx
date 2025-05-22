import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ChoiceSelector.css';

const ChoiceSelector = ({ question, choices, onSelect }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation timing for choices to appear
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 1000); // Wait 1 second after question appears
    
    return () => clearTimeout(timer);
  }, []);

  // Handle choice selection
  const handleChoiceClick = (choice) => {
    if (isAnimating) return;
    
    setSelectedChoice(choice.id);
    setIsAnimating(true);
    
    // Animation delay before moving to next scene
    setTimeout(() => {
      onSelect(question.id, choice.id, choice.psychImpact);
    }, 1500);
  };

  return (
    <div className="choice-selector">
      <div className="question-container">
        <h3 className="question-text">{question.text}</h3>
      </div>
      
      <div className={`choices-container ${isRevealed ? 'revealed' : ''}`}>
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            className={`choice-button ${selectedChoice === choice.id ? 'selected' : ''}`}
            onClick={() => handleChoiceClick(choice)}
            disabled={selectedChoice !== null}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {choice.text}
          </button>
        ))}
      </div>
      
      {selectedChoice && (
        <div className="choice-feedback">
          <div className="pulse-effect"></div>
        </div>
      )}
    </div>
  );
};

ChoiceSelector.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      psychImpact: PropTypes.object.isRequired
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default ChoiceSelector; 