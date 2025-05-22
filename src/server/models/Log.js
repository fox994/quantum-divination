import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  playerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Player'
  },
  type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: Object }
});

const Log = mongoose.model('Log', logSchema);

export default Log; 