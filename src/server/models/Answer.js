import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  playerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player',
    required: true 
  },
  chapterId: { type: Number, required: true },
  questionId: { type: String, required: true },
  answerId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer; 