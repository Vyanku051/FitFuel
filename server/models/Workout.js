const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  duration: Number,
  caloriesBurned: Number,
  notes: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workout', workoutSchema);