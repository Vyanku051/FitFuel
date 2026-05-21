import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AiSuggest = () => {
  const [caloriesLeft, setCaloriesLeft] = useState('');
  const [proteinLeft, setProteinLeft] = useState('');
  const [preferences, setPreferences] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) navigate('/');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/suggest',
        { caloriesLeft, proteinLeft, preferences },
        { headers }
      );
      setSuggestions(res.data);
    } catch (err) {
      setError('AI suggestion failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addToLog = async (meal) => {
    try {
      await axios.post('http://localhost:5000/api/meals', meal, { headers });
      alert(`${meal.name} added to your meal log!`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-400">AI Meal Suggest 🤖</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white"
        >
          ← Dashboard
        </button>
      </div>

      {/* Form */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">What are your remaining macros?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Calories remaining"
              value={caloriesLeft}
              onChange={(e) => setCaloriesLeft(e.target.value)}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Protein remaining (g)"
              value={proteinLeft}
              onChange={(e) => setProteinLeft(e.target.value)}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <input
            type="text"
            placeholder="Food preferences (e.g. I like eggs and chicken)"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 font-bold py-3 rounded-lg transition duration-200"
          >
            {loading ? 'Getting suggestions...' : 'Get AI Suggestions 🤖'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500 text-white p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">AI Suggestions 🍽️</h2>
          {suggestions.map((meal, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-purple-400">{meal.name}</h3>
                <button
                  onClick={() => addToLog(meal)}
                  className="bg-green-500 hover:bg-green-600 text-sm font-bold px-4 py-2 rounded-lg"
                >
                  Add to Log ✅
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-3">{meal.description}</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-gray-700 rounded-lg p-2">
                  <p className="text-yellow-400 font-bold">{meal.calories}</p>
                  <p className="text-gray-500 text-xs">kcal</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <p className="text-green-400 font-bold">{meal.protein}g</p>
                  <p className="text-gray-500 text-xs">protein</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <p className="text-blue-400 font-bold">{meal.carbs}g</p>
                  <p className="text-gray-500 text-xs">carbs</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-2">
                  <p className="text-red-400 font-bold">{meal.fat}g</p>
                  <p className="text-gray-500 text-xs">fat</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiSuggest;