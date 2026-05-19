import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogMeal = () => {
  const [meals, setMeals] = useState([]);
  const [formData, setFormData] = useState({
    name: '', calories: '', protein: '', carbs: '', fat: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch today's meals
  const fetchMeals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/meals/today', { headers });
      setMeals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!token) navigate('/');
    fetchMeals();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/meals', formData, { headers });
      setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      fetchMeals();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/meals/${id}`, { headers });
      fetchMeals();
    } catch (err) {
      console.log(err);
    }
  };

  // Calculate totals
  const totals = meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-500">Log Meal 🍗</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white"
        >
          ← Dashboard
        </button>
      </div>

      {/* Macro Totals */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Calories', value: totals.calories, unit: 'kcal', color: 'text-yellow-400' },
          { label: 'Protein', value: totals.protein, unit: 'g', color: 'text-green-400' },
          { label: 'Carbs', value: totals.carbs, unit: 'g', color: 'text-blue-400' },
          { label: 'Fat', value: totals.fat, unit: 'g', color: 'text-red-400' },
        ].map((macro) => (
          <div key={macro.label} className="bg-gray-800 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm">{macro.label}</p>
            <p className={`text-2xl font-bold ${macro.color}`}>{macro.value}</p>
            <p className="text-gray-500 text-xs">{macro.unit}</p>
          </div>
        ))}
      </div>

      {/* Add Meal Form */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add Meal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Meal name (e.g. Boiled Eggs)"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="calories"
              placeholder="Calories"
              value={formData.calories}
              onChange={handleChange}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="protein"
              placeholder="Protein (g)"
              value={formData.protein}
              onChange={handleChange}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="carbs"
              placeholder="Carbs (g)"
              value={formData.carbs}
              onChange={handleChange}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="fat"
              placeholder="Fat (g)"
              value={formData.fat}
              onChange={handleChange}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 font-bold py-3 rounded-lg transition duration-200"
          >
            {loading ? 'Adding...' : 'Add Meal ✅'}
          </button>
        </form>
      </div>

      {/* Meals List */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Today's Meals</h2>
        {meals.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No meals logged yet today</p>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div key={meal._id} className="bg-gray-700 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{meal.name}</p>
                  <p className="text-sm text-gray-400">
                    {meal.calories} kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(meal._id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogMeal;