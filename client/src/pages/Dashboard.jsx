import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) navigate('/');
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mealsRes, workoutsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/meals/today', { headers }),
        axios.get('http://localhost:5000/api/workouts', { headers })
      ]);
      setMeals(mealsRes.data);
      setWorkouts(workoutsRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Calculate totals
  const totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
  const totalProtein = meals.reduce((acc, meal) => acc + meal.protein, 0);
  const totalCarbs = meals.reduce((acc, meal) => acc + meal.carbs, 0);
  const totalFat = meals.reduce((acc, meal) => acc + meal.fat, 0);
  const calorieGoal = 2500;
  const proteinGoal = 150;
  const caloriesLeft = calorieGoal - totalCalories;
  const proteinLeft = proteinGoal - totalProtein;

  const totalWorkouts = workouts.length;
  const totalCaloriesBurned = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-500">FitFuel 🔥</h1>
          <p className="text-gray-400">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      {/* Calorie Progress */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Today's Calories</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-green-500 font-bold">{totalCalories} / {calorieGoal} kcal</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mt-2">{caloriesLeft > 0 ? `${caloriesLeft} kcal remaining` : 'Goal reached! 🎉'}</p>
      </div>

      {/* Macro Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Protein', value: totalProtein, goal: proteinGoal, unit: 'g', color: 'text-green-400' },
          { label: 'Carbs', value: totalCarbs, goal: 300, unit: 'g', color: 'text-blue-400' },
          { label: 'Fat', value: totalFat, goal: 80, unit: 'g', color: 'text-yellow-400' },
        ].map((macro) => (
          <div key={macro.label} className="bg-gray-800 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm">{macro.label}</p>
            <p className={`text-2xl font-bold ${macro.color}`}>{macro.value}g</p>
            <p className="text-gray-500 text-xs">of {macro.goal}g</p>
          </div>
        ))}
      </div>

      {/* Workout Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-sm">Workouts This Week</p>
          <p className="text-2xl font-bold text-green-400">{totalWorkouts}</p>
          <p className="text-gray-500 text-xs">sessions</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-4 text-center">
          <p className="text-gray-400 text-sm">Calories Burned</p>
          <p className="text-2xl font-bold text-yellow-400">{totalCaloriesBurned}</p>
          <p className="text-gray-500 text-xs">this week</p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Log Meal', emoji: '🍗', path: '/log-meal', color: 'bg-green-500' },
          { label: 'Workouts', emoji: '💪', path: '/workouts', color: 'bg-blue-500' },
          { label: 'AI Suggest', emoji: '🤖', path: '/ai-suggest', color: 'bg-purple-500' },
        ].map((card) => (
          <button
            key={card.label}
            onClick={() => navigate(card.path)}
            className={`${card.color} hover:opacity-90 rounded-2xl p-4 text-center font-bold transition duration-200`}
          >
            <div className="text-3xl mb-1">{card.emoji}</div>
            <div className="text-sm">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Recent Meals */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Today's Meals</h2>
        {meals.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No meals logged today</p>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div key={meal._id} className="bg-gray-700 rounded-xl p-3 flex justify-between">
                <p className="font-bold">{meal.name}</p>
                <p className="text-green-400">{meal.calories} kcal</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;