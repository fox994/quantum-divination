const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const startGame = async (name) => {
  try {
    const response = await fetch(`${API_URL}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      throw new Error('Failed to start game');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error starting game:', error);
    throw error;
  }
};

export const recordAnswer = async (playerId, chapterId, questionId, answerId, psychImpact) => {
  try {
    const response = await fetch(`${API_URL}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        playerId,
        chapterId,
        questionId,
        answerId,
        psychImpact
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to record answer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error recording answer:', error);
    throw error;
  }
};

export const getProgress = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/progress/${playerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get progress');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting progress:', error);
    throw error;
  }
};

export const getSummary = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/summary/${playerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get summary');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting summary:', error);
    throw error;
  }
}; 