import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import NarrativeText from '../components/narrative/NarrativeText';
import ChoiceSelector from '../components/narrative/ChoiceSelector';
import MiniGame from '../components/games/MiniGame';
import LoadingScreen from '../components/ui/LoadingScreen';
import { chapters } from '../data/chapterData';

function Chapter() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { player, recordAnswer, recordMiniGameResult, advanceChapter } = useGame();
  
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [chapterData, setChapterData] = useState(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  
  useEffect(() => {
    // Get chapter data
    const chapter = chapters.find(c => c.id === parseInt(chapterId));
    if (!chapter) {
      navigate('/');
      return;
    }
    
    setChapterData(chapter);
    setLoading(false);
  }, [chapterId, navigate]);
  
  // Handle player's choice selection
  const handleChoice = (questionId, answerId, psychImpact) => {
    recordAnswer(parseInt(chapterId), questionId, answerId, psychImpact);
    
    // Move to next step in the narrative
    setCurrentStep(prev => prev + 1);
    
    // Check if we should show mini-game
    if (chapterData?.miniGame && currentStep === chapterData.narrative.length - 1) {
      setShowMiniGame(true);
    }
    
    // Check if we should move to next chapter
    if (!chapterData?.miniGame && currentStep === chapterData?.narrative.length - 1) {
      handleChapterComplete();
    }
  };
  
  // Handle mini-game completion
  const handleGameComplete = (gameId, score, details) => {
    recordMiniGameResult(parseInt(chapterId), gameId, score, details);
    handleChapterComplete();
  };
  
  // Handle chapter completion
  const handleChapterComplete = () => {
    // Check if this is the final chapter
    if (parseInt(chapterId) === 8) {
      navigate('/results');
      return;
    }
    
    // Advance to next chapter
    advanceChapter();
    navigate(`/chapter/${parseInt(chapterId) + 1}`);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Show mini-game if it's time
  if (showMiniGame && chapterData?.miniGame) {
    return (
      <MiniGame 
        gameData={chapterData.miniGame}
        onComplete={handleGameComplete}
      />
    );
  }
  
  // Show narrative and choices
  const currentNarrative = chapterData?.narrative[currentStep];
  
  return (
    <div className="chapter-container">
      <h1 className="chapter-title">{chapterData?.title}</h1>
      
      {currentNarrative && (
        <>
          <NarrativeText text={currentNarrative.text} />
          
          {currentNarrative.question && (
            <ChoiceSelector
              question={currentNarrative.question}
              choices={currentNarrative.choices}
              onSelect={handleChoice}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Chapter; 