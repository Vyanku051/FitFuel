const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { addWorkout, getWorkouts, deleteWorkout } = require('../controllers/workoutController');

router.post('/', protect, addWorkout);
router.get('/', protect, getWorkouts);
router.delete('/:id', protect, deleteWorkout);

module.exports = router;