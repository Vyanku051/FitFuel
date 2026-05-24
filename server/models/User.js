const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  // Physical Info
  age: Number,
  gender: String, // 'male' or 'female'
  height: Number, // cm
  weight: Number, // kg

  // Goal
  goal: String, // 'lose_weight', 'maintain', 'gain_muscle'
  activityLevel: String, // 'sedentary', 'light', 'moderate', 'very_active'

  // Calculated Goals (auto or manually adjusted)
  dailyCalorieGoal: { type: Number, default: 2000 },
  dailyProteinGoal: { type: Number, default: 150 },
  dailyCarbsGoal: { type: Number, default: 250 },
  dailyFatGoal: { type: Number, default: 70 },

  // Onboarding completed
  onboardingDone: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);