const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { register, login, completeOnboarding, getProfile } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/onboarding', protect, completeOnboarding);
router.get('/profile', protect, getProfile);

module.exports = router;