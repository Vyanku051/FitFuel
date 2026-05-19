const Workout = require('../models/Workout');

// Add workout
const addWorkout = async (req, res) => {
  try {
    const { type, duration, caloriesBurned, notes } = req.body;

    const workout = await Workout.create({
      userId: req.user.id,
      type,
      duration,
      caloriesBurned,
      notes
    });

    res.status(201).json(workout);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get this week's workouts
const getWorkouts = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const workouts = await Workout.find({
      userId: req.user.id,
      date: { $gte: start }
    }).sort({ date: -1 });

    res.json(workouts);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete workout
const deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addWorkout, getWorkouts, deleteWorkout };