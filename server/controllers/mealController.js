const Meal = require('../models/Meal');

// Add meal
const addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat } = req.body;

    const meal = await Meal.create({
      userId: req.user.id,
      name,
      calories,
      protein,
      carbs,
      fat
    });

    res.status(201).json(meal);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get today's meals
const getTodayMeals = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    res.json(meals);

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete meal
const deleteMeal = async (req, res) => {
  try {
    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addMeal, getTodayMeals, deleteMeal };