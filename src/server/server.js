import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Player from './models/Player.js';
import Answer from './models/Answer.js';
import Log from './models/Log.js';

// 加載環境變數
dotenv.config();

// 連接到 MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/start', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // 創建玩家
    const newPlayer = new Player({
      name,
      psychProfile: {
        observer: 0,
        entanglement: 0,
        collapse: 0,
        interference: 0,
        reflection: 0
      },
      currentChapter: 1
    });
    
    const savedPlayer = await newPlayer.save();
    
    // 記錄日誌
    await new Log({
      playerId: savedPlayer._id,
      type: 'PLAYER_CREATED',
      data: { name }
    }).save();
    
    res.status(201).json({
      playerId: savedPlayer._id,
      name: savedPlayer.name,
      currentChapter: savedPlayer.currentChapter
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/answer', async (req, res) => {
  try {
    const { playerId, chapterId, questionId, answerId, psychImpact } = req.body;
    
    if (!playerId || !chapterId || !questionId || !answerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // 查找玩家
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // 記錄回答
    const newAnswer = new Answer({
      playerId,
      chapterId,
      questionId,
      answerId
    });
    
    await newAnswer.save();
    
    // 更新玩家心理資料
    if (psychImpact) {
      Object.keys(psychImpact).forEach(key => {
        if (player.psychProfile[key] !== undefined) {
          player.psychProfile[key] += psychImpact[key];
        }
      });
      
      await player.save();
    }
    
    // 記錄日誌
    await new Log({
      playerId,
      type: 'ANSWER_RECORDED',
      data: { chapterId, questionId, answerId, psychImpact }
    }).save();
    
    res.status(200).json({
      success: true,
      newPsychProfile: player.psychProfile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/progress/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    
    if (!playerId) {
      return res.status(400).json({ error: 'Player ID is required' });
    }
    
    // 查找玩家
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // 獲取玩家回答
    const playerAnswers = await Answer.find({ playerId });
    
    res.status(200).json({
      player: {
        id: player._id,
        name: player.name,
        currentChapter: player.currentChapter,
        psychProfile: player.psychProfile
      },
      answers: playerAnswers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/summary/:playerId', async (req, res) => {
  try {
    const { playerId } = req.params;
    
    if (!playerId) {
      return res.status(400).json({ error: 'Player ID is required' });
    }
    
    // 查找玩家
    const player = await Player.findById(playerId);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // 獲取玩家回答
    const playerAnswers = await Answer.find({ playerId });
    
    // 計算玩家主要傾向
    const psychProfile = player.psychProfile;
    const dominantTrait = Object.entries(psychProfile)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // 根據主要傾向計算結局類型
    let endingType = 'superposition'; // 預設
    
    if (dominantTrait === 'collapse') {
      endingType = 'collapse';
    } else if (dominantTrait === 'entanglement') {
      endingType = 'entanglement';
    } else if (dominantTrait === 'reflection') {
      endingType = 'reflection';
    } else if (dominantTrait === 'interference') {
      endingType = 'interference';
    }
    
    // 檢查隱藏結局
    const rejectAnswers = await Answer.find({ 
      playerId,
      $or: [
        { answerId: 'reject_observation' },
        { answerId: { $regex: /reject/ } }
      ]
    });
    
    if (rejectAnswers.length === playerAnswers.length && playerAnswers.length > 0) {
      endingType = 'hidden';
    }
    
    res.status(200).json({
      player: {
        id: player._id,
        name: player.name,
        psychProfile
      },
      summary: {
        dominantTrait,
        endingType,
        totalChoices: playerAnswers.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 首頁路由
app.get('/', (req, res) => {
  res.send('量子筊問 API 伺服器正在運行');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 