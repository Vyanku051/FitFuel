const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { addMeal, getTodayMeals, deleteMeal } = require('../controllers/mealController');

router.post('/', protect, addMeal);
router.get('/today', protect, getTodayMeals);
router.delete('/:id', protect, deleteMeal);

module.exports = router;