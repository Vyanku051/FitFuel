const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getMealSuggestions } = require('../controllers/aiController');

router.post('/suggest', protect, getMealSuggestions);

module.exports = router;