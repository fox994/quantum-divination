/**
 * Calculate which ending the player will receive based on their choices and game performance
 * 
 * @param {Array} answers - Player's answers throughout the game
 * @param {Object} psychProfile - Player's psychological profile scores
 * @param {Array} miniGameResults - Results from mini-games
 * @returns {Object} The ending details
 */
export const calculateEnding = (answers, psychProfile, miniGameResults) => {
  // Normalize psych profile to get primary tendency
  const profileTotal = Object.values(psychProfile).reduce((sum, val) => sum + Math.abs(val), 0);
  const normalizedProfile = {};
  
  Object.keys(psychProfile).forEach(key => {
    normalizedProfile[key] = profileTotal > 0 
      ? psychProfile[key] / profileTotal 
      : 0;
  });
  
  // Find dominant trait
  const dominantTrait = Object.entries(normalizedProfile)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  // Check for hidden ending conditions
  const hasRejectedAllObservations = answers.every(a => 
    a.answerId === 'reject_observation' || a.answerId.includes('reject')
  );
  
  const hasDeletedAllRecords = miniGameResults.some(
    result => result.gameId === 'final_decision' && result.details.action === 'delete_all'
  );
  
  // Calculate consistency score (how consistent player's choices were)
  const chapterChoices = {};
  answers.forEach(answer => {
    if (!chapterChoices[answer.chapterId]) {
      chapterChoices[answer.chapterId] = [];
    }
    chapterChoices[answer.chapterId].push(answer.answerId);
  });
  
  let consistencyScore = 0;
  Object.values(chapterChoices).forEach(choices => {
    // Check if all choices in a chapter follow a pattern
    const pattern = choices[0]?.split('_')[0];
    const consistent = choices.every(c => c.startsWith(pattern));
    if (consistent) consistencyScore++;
  });
  
  // Get average mini-game performance
  const avgGameScore = miniGameResults.length > 0
    ? miniGameResults.reduce((sum, result) => sum + result.score, 0) / miniGameResults.length
    : 0;
  
  // Determine ending
  if (hasRejectedAllObservations && hasDeletedAllRecords) {
    return {
      type: 'hidden',
      title: '觀測者消失',
      description: '若一切不曾被觀測，是否也不曾存在？',
      details: {
        trait: dominantTrait,
        consistency: consistencyScore,
        gamePerformance: avgGameScore
      }
    };
  }
  
  // Main endings
  if (dominantTrait === 'collapse' || consistencyScore > 6) {
    return {
      type: 'collapse',
      title: '塌縮結局：命定觀測者',
      description: '你終於「觀測完畢」，卻成為別人眼中的定義者，而非自己。',
      details: {
        trait: dominantTrait,
        consistency: consistencyScore,
        gamePerformance: avgGameScore
      }
    };
  } 
  
  if (dominantTrait === 'entanglement' && avgGameScore > 0.7) {
    return {
      type: 'entanglement',
      title: '糾纏結局：雙人共振',
      description: '你們產生共鳴，進入「共糾纏態」，看似終結但實為開始。',
      details: {
        trait: dominantTrait,
        consistency: consistencyScore,
        gamePerformance: avgGameScore
      }
    };
  }
  
  if (dominantTrait === 'reflection') {
    return {
      type: 'reflection',
      title: '反射結局：鏡像自我',
      description: '未來的你取代了現在的你，故事輪迴開啟。',
      details: {
        trait: dominantTrait,
        consistency: consistencyScore,
        gamePerformance: avgGameScore
      }
    };
  }
  
  if (dominantTrait === 'interference') {
    return {
      type: 'interference',
      title: '干涉結局：混沌干擾',
      description: '你無法再被定義，也無法再定義他人，只留下未記錄的觀測殘影。',
      details: {
        trait: dominantTrait,
        consistency: consistencyScore,
        gamePerformance: avgGameScore
      }
    };
  }
  
  // Default ending if no specific condition is met
  return {
    type: 'superposition',
    title: '疊加結局：漂浮狀態',
    description: '故事保持在未定義狀態，你失去了結局，也逃避了選擇。',
    details: {
      trait: dominantTrait,
      consistency: consistencyScore,
      gamePerformance: avgGameScore
    }
  };
}; 