import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './NarrativeText.css';

const NarrativeText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const textRef = useRef(null);
  
  // Text typing animation effect
  useEffect(() => {
    if (showFullText) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }
    
    let index = 0;
    const typingSpeed = 30; // milliseconds per character
    
    setDisplayedText('');
    setIsTyping(true);
    
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeed);
    
    return () => clearInterval(typingInterval);
  }, [text, showFullText]);
  
  // Handle click to show full text immediately
  const handleClick = () => {
    if (isTyping) {
      setShowFullText(true);
    }
  };
  
  // Split text into paragraphs
  const paragraphs = displayedText.split('\n\n').filter(p => p.trim() !== '');
  
  return (
    <div 
      className={`narrative-text ${isTyping ? 'typing' : 'completed'}`}
      onClick={handleClick}
      ref={textRef}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="narrative-paragraph">
          {paragraph}
        </p>
      ))}
      
      {isTyping && (
        <div className="skip-hint">點擊以略過</div>
      )}
    </div>
  );
};

NarrativeText.propTypes = {
  text: PropTypes.string.isRequired
};

export default NarrativeText; 