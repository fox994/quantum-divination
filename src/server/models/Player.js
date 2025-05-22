import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  psychProfile: {
    observer: { type: Number, default: 0 },
    entanglement: { type: Number, default: 0 },
    collapse: { type: Number, default: 0 },
    interference: { type: Number, default: 0 },
    reflection: { type: Number, default: 0 }
  },
  currentChapter: { type: Number, default: 1 }
});

const Player = mongoose.model('Player', playerSchema);

export default Player; 