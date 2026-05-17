const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  dailyCalorieGoal: { type: Number, default: 2500 },
  dailyProteinGoal: { type: Number, default: 150 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);