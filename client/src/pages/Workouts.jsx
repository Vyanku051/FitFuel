import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const workoutTypes = ['Gym', 'MMA', 'Running', 'Cycling', 'Swimming', 'Other'];

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    type: 'Gym',
    duration: '',
    caloriesBurned: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchWorkouts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/workouts', { headers });
      setWorkouts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!token) navigate('/');
    fetchWorkouts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/workouts', formData, { headers });
      setFormData({ type: 'Gym', duration: '', caloriesBurned: '', notes: '' });
      fetchWorkouts();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`, { headers });
      fetchWorkouts();
    } catch (err) {
      console.log(err);
    }
  };

  // Weekly summary
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((acc, w) => acc + w.duration, 0);
  const totalCaloriesBurned = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);

  const getTypeEmoji = (type) => {
    const emojis = { Gym: '🏋️', MMA: '🥊', Running: '🏃', Cycling: '🚴', Swimming: '🏊', Other: '💪' };
    return emojis[type] || '💪';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-green-500">Workouts 💪</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-400 hover:text-white"
        >
          ← Dashboard
        </button>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Workouts This Week', value: totalWorkouts, unit: 'sessions', color: 'text-green-400' },
          { label: 'Total Time', value: totalMinutes, unit: 'minutes', color: 'text-blue-400' },
          { label: 'Calories Burned', value: totalCaloriesBurned, unit: 'kcal', color: 'text-yellow-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-800 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-500 text-xs">{stat.unit}</p>
          </div>
        ))}
      </div>

      {/* Add Workout Form */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Log Workout</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Workout Type Buttons */}
          <div className="flex flex-wrap gap-2">
            {workoutTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, type })}
                className={`px-4 py-2 rounded-lg font-bold transition duration-200 ${
                  formData.type === type
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {getTypeEmoji(type)} {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={handleChange}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              name="caloriesBurned"
              placeholder="Calories Burned"
              value={formData.caloriesBurned}
              onChange={handleChange}
              required
              className="bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input
            type="text"
            name="notes"
            placeholder="Notes (e.g. Chest and triceps day)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-gray-700 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 font-bold py-3 rounded-lg transition duration-200"
          >
            {loading ? 'Logging...' : 'Log Workout ✅'}
          </button>
        </form>
      </div>

      {/* Workouts List */}
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">This Week's Workouts</h2>
        {workouts.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No workouts logged this week</p>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div key={workout._id} className="bg-gray-700 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{getTypeEmoji(workout.type)} {workout.type}</p>
                  <p className="text-sm text-gray-400">
                    {workout.duration} mins | {workout.caloriesBurned} kcal burned
                  </p>
                  {workout.notes && (
                    <p className="text-sm text-gray-500 mt-1">{workout.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(workout._id)}
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

export default Workouts;