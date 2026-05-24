const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      onboardingDone: false
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name,
        email,
        onboardingDone: false
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingDone: user.onboardingDone,
        dailyCalorieGoal: user.dailyCalorieGoal,
        dailyProteinGoal: user.dailyProteinGoal,
        dailyCarbsGoal: user.dailyCarbsGoal,
        dailyFatGoal: user.dailyFatGoal,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Complete Onboarding
const completeOnboarding = async (req, res) => {
  try {
    const { age, gender, height, weight, goal, activityLevel } = req.body;

    // BMR Calculation (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity Multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725
    };
    let tdee = bmr * multipliers[activityLevel];

    // Goal Adjustment
    if (goal === 'lose_weight') tdee -= 500;
    else if (goal === 'gain_muscle') tdee += 300;

    const dailyCalorieGoal = Math.round(tdee);

    // Macro Calculation
    const dailyProteinGoal = Math.round(weight * 2);
    const dailyFatGoal = Math.round((tdee * 0.25) / 9);
    const dailyCarbsGoal = Math.round((tdee - (dailyProteinGoal * 4) - (dailyFatGoal * 9)) / 4);

    // Update User
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        age, gender, height, weight,
        goal, activityLevel,
        dailyCalorieGoal,
        dailyProteinGoal,
        dailyCarbsGoal,
        dailyFatGoal,
        onboardingDone: true
      },
      { new: true }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingDone: true,
        dailyCalorieGoal,
        dailyProteinGoal,
        dailyCarbsGoal,
        dailyFatGoal,
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, completeOnboarding, getProfile };